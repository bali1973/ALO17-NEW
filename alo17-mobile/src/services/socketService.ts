import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'listing' | 'favorite' | 'system';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
  isRead: boolean;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();

  // Socket bağlantısını başlat
  async initialize(userId: string, token: string) {
    try {
      // Mevcut bağlantıyı kapat
      if (this.socket) {
        this.socket.disconnect();
      }

      // Yeni bağlantı oluştur
      this.socket = io('http://localhost:3004', {
        auth: {
          token,
          userId,
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: this.maxReconnectAttempts,
      });

      // Event listener'ları kur
      this.setupEventListeners();

      // Bağlantı durumunu kaydet
      await AsyncStorage.setItem('socket-connected', 'true');
      
      console.log('Socket.io bağlantısı başlatıldı');
    } catch (error) {
      console.error('Socket.io bağlantı hatası:', error);
      throw error;
    }
  }

  // Event listener'ları kur
  private setupEventListeners() {
    if (!this.socket) return;

    // Bağlantı başarılı
    this.socket.on('connect', () => {
      console.log('Socket.io bağlandı');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('user-online', { timestamp: new Date().toISOString() });
    });

    // Bağlantı kesildi
    this.socket.on('disconnect', (reason) => {
      console.log('Socket.io bağlantısı kesildi:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Sunucu tarafından kesildi, yeniden bağlan
        this.socket?.connect();
      }
    });

    // Bağlantı hatası
    this.socket.on('connect_error', (error) => {
      console.error('Socket.io bağlantı hatası:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
      }
    });

    // Yeniden bağlanma
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket.io yeniden bağlandı, deneme:', attemptNumber);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    // Yeni mesaj
    this.socket.on('new-message', (message: Message) => {
      console.log('Yeni mesaj alındı:', message);
      this.triggerListeners('new-message', message);
    });

    // Mesaj okundu
    this.socket.on('message-read', (data: { messageId: string; conversationId: string }) => {
      console.log('Mesaj okundu:', data);
      this.triggerListeners('message-read', data);
    });

    // Yeni bildirim
    this.socket.on('new-notification', (notification: Notification) => {
      console.log('Yeni bildirim alındı:', notification);
      this.triggerListeners('new-notification', notification);
    });

    // İlan güncellemesi
    this.socket.on('listing-updated', (listing: any) => {
      console.log('İlan güncellendi:', listing);
      this.triggerListeners('listing-updated', listing);
    });

    // Kullanıcı çevrimiçi/çevrimdışı
    this.socket.on('user-status-change', (data: { userId: string; isOnline: boolean }) => {
      console.log('Kullanıcı durumu değişti:', data);
      this.triggerListeners('user-status-change', data);
    });

    // Typing indicator
    this.socket.on('typing-start', (data: { conversationId: string; userId: string; userName: string }) => {
      console.log('Yazıyor başladı:', data);
      this.triggerListeners('typing-start', data);
    });

    this.socket.on('typing-stop', (data: { conversationId: string; userId: string }) => {
      console.log('Yazıyor durdu:', data);
      this.triggerListeners('typing-stop', data);
    });
  }

  // Event gönder
  emit(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket bağlantısı yok, event gönderilemedi:', event);
    }
  }

  // Event listener ekle
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Event listener kaldır
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Listener'ları tetikle
  private triggerListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Socket listener hatası:', error);
        }
      });
    }
  }

  // Mesaj gönder
  sendMessage(conversationId: string, content: string) {
    this.emit('send-message', {
      conversationId,
      content,
      timestamp: new Date().toISOString(),
    });
  }

  // Mesajı okundu olarak işaretle
  markMessageAsRead(messageId: string, conversationId: string) {
    this.emit('mark-message-read', {
      messageId,
      conversationId,
    });
  }

  // Typing indicator gönder
  startTyping(conversationId: string) {
    this.emit('typing-start', { conversationId });
  }

  stopTyping(conversationId: string) {
    this.emit('typing-stop', { conversationId });
  }

  // Çevrimiçi durumu güncelle
  updateOnlineStatus(isOnline: boolean) {
    this.emit('update-status', { isOnline });
  }

  // Odaya katıl
  joinRoom(roomId: string) {
    this.emit('join-room', { roomId });
  }

  // Odadan çık
  leaveRoom(roomId: string) {
    this.emit('leave-room', { roomId });
  }

  // Bağlantı durumunu kontrol et
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Bağlantıyı kapat
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
    
    AsyncStorage.removeItem('socket-connected');
    console.log('Socket.io bağlantısı kapatıldı');
  }

  // Bağlantıyı yeniden kur
  async reconnect(userId: string, token: string) {
    console.log('Socket.io yeniden bağlanıyor...');
    await this.initialize(userId, token);
  }

  // Ping gönder
  ping() {
    this.emit('ping', { timestamp: Date.now() });
  }

  // Pong al
  onPong(callback: (latency: number) => void) {
    this.on('pong', (data: { timestamp: number }) => {
      const latency = Date.now() - data.timestamp;
      callback(latency);
    });
  }
}

export default new SocketService(); 