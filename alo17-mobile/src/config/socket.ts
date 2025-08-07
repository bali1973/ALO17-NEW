// Socket.io Server Configuration
export const SOCKET_CONFIG = {
  // Production server
  PRODUCTION: {
    url: process.env.SOCKET_SERVER_URL || 'wss://alo17-api.com',
    port: process.env.SOCKET_SERVER_PORT || '443',
    secure: true,
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
  },
  
  // Development server
  DEVELOPMENT: {
    url: process.env.SOCKET_DEV_SERVER_URL || 'ws://localhost:3004',
    port: process.env.SOCKET_DEV_SERVER_PORT || '3004',
    secure: false,
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
  },
  
  // Get config based on environment
  getConfig() {
    return process.env.NODE_ENV === 'production' 
      ? this.PRODUCTION 
      : this.DEVELOPMENT;
  },
  
  // Socket events
  events: {
    // Connection events
    connect: 'connect',
    disconnect: 'disconnect',
    connectError: 'connect_error',
    reconnect: 'reconnect',
    reconnectAttempt: 'reconnect_attempt',
    reconnectError: 'reconnect_error',
    reconnectFailed: 'reconnect_failed',
    
    // Authentication events
    authenticate: 'authenticate',
    authenticationSuccess: 'authentication_success',
    authenticationFailed: 'authentication_failed',
    
    // User events
    userOnline: 'user-online',
    userOffline: 'user-offline',
    userStatusChange: 'user-status-change',
    
    // Message events
    sendMessage: 'send-message',
    newMessage: 'new-message',
    messageRead: 'message-read',
    messageDelivered: 'message-delivered',
    typingStart: 'typing-start',
    typingStop: 'typing-stop',
    
    // Notification events
    newNotification: 'new-notification',
    notificationRead: 'notification-read',
    
    // Listing events
    listingCreated: 'listing-created',
    listingUpdated: 'listing-updated',
    listingDeleted: 'listing-deleted',
    listingApproved: 'listing-approved',
    listingRejected: 'listing-rejected',
    
    // Payment events
    paymentInitiated: 'payment-initiated',
    paymentSuccess: 'payment-success',
    paymentFailed: 'payment-failed',
    
    // System events
    systemMaintenance: 'system-maintenance',
    systemUpdate: 'system-update',
    
    // Room events
    joinRoom: 'join-room',
    leaveRoom: 'leave-room',
    roomMessage: 'room-message',
    
    // Ping/Pong
    ping: 'ping',
    pong: 'pong',
  },
  
  // Room types
  rooms: {
    general: 'general',
    support: 'support',
    announcements: 'announcements',
    user: (userId: string) => `user_${userId}`,
    conversation: (conversationId: string) => `conversation_${conversationId}`,
    listing: (listingId: string) => `listing_${listingId}`,
  },
  
  // Message types
  messageTypes: {
    text: 'text',
    image: 'image',
    file: 'file',
    location: 'location',
    system: 'system',
  },
  
  // User status
  userStatus: {
    online: 'online',
    offline: 'offline',
    away: 'away',
    busy: 'busy',
  },
  
  // Connection states
  connectionStates: {
    connecting: 'connecting',
    connected: 'connected',
    disconnected: 'disconnected',
    reconnecting: 'reconnecting',
    failed: 'failed',
  },
  
  // Error codes
  errorCodes: {
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
    MESSAGE_TOO_LONG: 'MESSAGE_TOO_LONG',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    SERVER_ERROR: 'SERVER_ERROR',
  },
  
  // Rate limiting
  rateLimits: {
    messageSend: {
      maxMessages: 10,
      timeWindow: 60000, // 1 minute
    },
    connectionAttempts: {
      maxAttempts: 5,
      timeWindow: 300000, // 5 minutes
    },
  },
  
  // Heartbeat configuration
  heartbeat: {
    interval: 30000, // 30 seconds
    timeout: 10000, // 10 seconds
  },
  
  // Message queue configuration
  messageQueue: {
    maxRetries: 3,
    retryDelay: 5000, // 5 seconds
    maxQueueSize: 100,
  },
};

// Socket authentication
export const SOCKET_AUTH = {
  // Token validation
  validateToken: (token: string): boolean => {
    // Basic token validation
    return token && token.length > 10;
  },
  
  // Generate authentication payload
  generateAuthPayload: (userId: string, token: string) => {
    return {
      userId,
      token,
      timestamp: Date.now(),
      deviceInfo: {
        platform: 'react-native',
        version: '1.0.0',
      },
    };
  },
  
  // Authentication response
  authResponse: {
    success: {
      status: 'success',
      message: 'Authentication successful',
    },
    failed: {
      status: 'failed',
      message: 'Authentication failed',
    },
  },
};

// Socket message structure
export interface SocketMessage {
  id: string;
  type: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  roomId?: string;
  metadata?: any;
}

// Socket event handlers
export const SOCKET_HANDLERS = {
  // Connection handlers
  onConnect: (socket: any) => {
    console.log('Socket connected:', socket.id);
  },
  
  onDisconnect: (socket: any, reason: string) => {
    console.log('Socket disconnected:', socket.id, 'Reason:', reason);
  },
  
  onError: (socket: any, error: any) => {
    console.error('Socket error:', error);
  },
  
  // Message handlers
  onMessage: (socket: any, message: SocketMessage) => {
    console.log('Message received:', message);
    // Handle message logic
  },
  
  // Authentication handlers
  onAuthenticate: (socket: any, authData: any) => {
    console.log('Authentication attempt:', authData);
    // Handle authentication logic
  },
}; 