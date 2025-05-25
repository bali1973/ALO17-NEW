const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Socket server is running' });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Aktif odaları tutmak için
const activeRooms = new Map();

io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }
    activeRooms.get(roomId).add(socket.id);
    console.log(`Kullanıcı ${socket.id} odaya katıldı: ${roomId}`);
  });

  socket.on('send_message', (data) => {
    const { roomId, ...message } = data;
    io.to(roomId).emit('receive_message', {
      ...message,
      senderId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
    // Kullanıcının bulunduğu odalardan çıkar
    activeRooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          activeRooms.delete(roomId);
        }
      }
    });
  });
});

// Port ayarını düzelt
const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Socket.IO sunucusu ${PORT} portunda çalışıyor`);
}); 