const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { sendPushNotification } = require('./src/lib/push');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // --- SOCKET.IO ENTEGRASYONU ---
  const { Server } = require('socket.io');
  const { PrismaClient } = require('@prisma/client');
  const jwt = require('jsonwebtoken');
  const prisma = new PrismaClient();
  const io = new Server(httpServer, {
    path: '/socket.io',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // JWT doğrulama middleware'i
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    try {
      // JWT_SECRET .env'den alınmalı, burada örnek için sabit
      const secret = process.env.JWT_SECRET || 'alo17_secret';
      const decoded = jwt.verify(token, secret);
      socket.user = decoded; // userId, email, vs.
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id, 'User:', socket.user?.id);

    // Odaya katılma
    socket.on('join room', (roomId) => {
      socket.join(roomId);
      console.log(`Kullanıcı ${socket.user?.id} odaya katıldı: ${roomId}`);
    });

    // Chat mesajı gönderme
    socket.on('chat message', async (msg) => {
      // msg: { content, receiverId, roomId, listingId }
      try {
        const savedMessage = await prisma.message.create({
          data: {
            content: msg.content,
            senderId: socket.user.id,
            receiverId: msg.receiverId,
            senderName: socket.user.name || '',
            senderEmail: socket.user.email || '',
            listingId: msg.listingId || null,
          },
        });
        // Sadece ilgili odaya mesajı ilet
        io.to(msg.roomId).emit('chat message', savedMessage);
        // Push notification gönder
        const receiver = await prisma.user.findUnique({ where: { id: msg.receiverId } });
        if (receiver?.pushToken) {
          sendPushNotification(
            receiver.pushToken,
            'Yeni Mesaj',
            `${socket.user.name || 'Bir kullanıcı'}: ${msg.content}`,
            { senderId: socket.user.id, messageId: savedMessage.id }
          );
        }
      } catch (err) {
        console.error('Mesaj kaydedilemedi:', err);
        socket.emit('chat error', { error: 'Mesaj kaydedilemedi.' });
      }
    });

    // Mesaj okundu bilgisi
    socket.on('message read', async ({ messageId, roomId }) => {
      try {
        const updated = await prisma.message.update({
          where: { id: messageId },
          data: { isRead: true },
        });
        // Odaya bildir (karşı tarafın ekranında okundu olarak işaretlensin)
        io.to(roomId).emit('message read', { messageId, readerId: socket.user.id });
      } catch (err) {
        console.error('Okundu bilgisi güncellenemedi:', err);
        socket.emit('chat error', { error: 'Okundu bilgisi güncellenemedi.' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Kullanıcı ayrıldı:', socket.id, 'User:', socket.user?.id);
    });
  });
  // --- SOCKET.IO ENTEGRASYONU SONU ---

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('> Socket.io server ready!');
    });
}); 