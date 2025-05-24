import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = (roomId?: string) => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Socket.IO bağlantısını başlat
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    socketRef.current = socket

    // Bağlantı durumu değişikliklerini dinle
    socket.on('connect', () => {
      console.log('Socket.IO bağlantısı kuruldu')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket.IO bağlantısı koptu')
      setIsConnected(false)
    })

    // Mesaj alma
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    // Odaya katıl
    if (roomId) {
      socket.emit('join_room', roomId)
    }

    // Temizleme
    return () => {
      socket.disconnect()
    }
  }, [roomId])

  // Mesaj gönderme fonksiyonu
  const sendMessage = (message: any) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('send_message', {
        ...message,
        roomId,
      })
    }
  }

  return {
    isConnected,
    messages,
    sendMessage,
  }
} 