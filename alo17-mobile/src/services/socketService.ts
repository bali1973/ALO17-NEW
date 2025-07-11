import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://localhost:3000'; // Gerekirse IP ile değiştirin

let socket: Socket | null = null;

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem('token');
  socket = io(SOCKET_URL, {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
};

export const joinRoom = (roomId: string) => {
  socket?.emit('join room', roomId);
};

export const sendMessage = (msg: {
  content: string;
  receiverId: string;
  roomId: string;
  listingId?: string;
}) => {
  socket?.emit('chat message', msg);
};

export const onMessage = (callback: (msg: any) => void) => {
  socket?.on('chat message', callback);
};

// Mesajı okundu olarak işaretle
export const markMessageAsRead = (messageId: string, roomId: string) => {
  socket?.emit('message read', { messageId, roomId });
};

// Okundu event'ını dinle
export const onMessageRead = (callback: (data: { messageId: string; readerId: string }) => void) => {
  socket?.on('message read', callback);
};

export const disconnectSocket = () => {
  socket?.disconnect();
}; 