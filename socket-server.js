const { Server } = require('socket.io')
const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Socket.IO bağlantı yönetimi
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id)

  // Kullanıcı odaya katılma
  socket.on('join_room', (roomId) => {
    socket.join(roomId)
    console.log(`Kullanıcı ${socket.id} odaya katıldı: ${roomId}`)
  })

  // Mesaj gönderme
  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', {
      ...data,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    })
  })

  // Bağlantı koptuğunda
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO sunucusu ${PORT} portunda çalışıyor`)
}) 