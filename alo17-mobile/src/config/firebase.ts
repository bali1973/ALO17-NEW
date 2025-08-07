// Firebase Configuration for Push Notifications
export const FIREBASE_CONFIG = {
  // Production Firebase config
  PRODUCTION: {
    apiKey: process.env.FIREBASE_API_KEY || 'YOUR_FIREBASE_API_KEY',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'alo17-app.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'alo17-app',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'alo17-app.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
    appId: process.env.FIREBASE_APP_ID || 'YOUR_APP_ID',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'YOUR_MEASUREMENT_ID',
  },
  
  // Development Firebase config
  DEVELOPMENT: {
    apiKey: process.env.FIREBASE_DEV_API_KEY || 'DEV_FIREBASE_API_KEY',
    authDomain: process.env.FIREBASE_DEV_AUTH_DOMAIN || 'alo17-dev.firebaseapp.com',
    projectId: process.env.FIREBASE_DEV_PROJECT_ID || 'alo17-dev',
    storageBucket: process.env.FIREBASE_DEV_STORAGE_BUCKET || 'alo17-dev.appspot.com',
    messagingSenderId: process.env.FIREBASE_DEV_MESSAGING_SENDER_ID || 'DEV_SENDER_ID',
    appId: process.env.FIREBASE_DEV_APP_ID || 'DEV_APP_ID',
    measurementId: process.env.FIREBASE_DEV_MEASUREMENT_ID || 'DEV_MEASUREMENT_ID',
  },
  
  // Get config based on environment
  getConfig() {
    return process.env.NODE_ENV === 'production' 
      ? this.PRODUCTION 
      : this.DEVELOPMENT;
  },
  
  // FCM Server Key (for sending notifications from backend)
  serverKey: process.env.FCM_SERVER_KEY || 'YOUR_FCM_SERVER_KEY',
  
  // FCM Topics
  topics: {
    general: 'general',
    promotions: 'promotions',
    newListings: 'new_listings',
    messages: 'messages',
    system: 'system',
  },
  
  // Notification channels (Android)
  channels: {
    general: {
      id: 'general',
      name: 'Genel Bildirimler',
      description: 'Genel uygulama bildirimleri',
      importance: 'high',
      sound: 'default',
    },
    messages: {
      id: 'messages',
      name: 'Mesaj Bildirimleri',
      description: 'Yeni mesaj bildirimleri',
      importance: 'high',
      sound: 'message',
    },
    payments: {
      id: 'payments',
      name: 'Ödeme Bildirimleri',
      description: 'Ödeme işlem bildirimleri',
      importance: 'high',
      sound: 'payment',
    },
    promotions: {
      id: 'promotions',
      name: 'Promosyon Bildirimleri',
      description: 'Kampanya ve promosyon bildirimleri',
      importance: 'default',
      sound: 'promotion',
    },
  },
};

// Notification templates
export const NOTIFICATION_TEMPLATES = {
  welcome: {
    title: 'Alo17\'e Hoş Geldiniz! 🎉',
    body: 'İlan vermeye başlamak için hemen giriş yapın.',
    data: {
      type: 'welcome',
      action: 'navigate_to_home',
    },
  },
  
  newMessage: {
    title: 'Yeni Mesaj 📱',
    body: '{{senderName}} size mesaj gönderdi: {{message}}',
    data: {
      type: 'message',
      action: 'navigate_to_chat',
      conversationId: '{{conversationId}}',
    },
  },
  
  listingApproved: {
    title: 'İlanınız Onaylandı ✅',
    body: '{{listingTitle}} ilanınız başarıyla yayınlandı.',
    data: {
      type: 'listing_approved',
      action: 'navigate_to_listing',
      listingId: '{{listingId}}',
    },
  },
  
  listingRejected: {
    title: 'İlanınız Reddedildi ❌',
    body: '{{listingTitle}} ilanınız reddedildi. Detaylar için tıklayın.',
    data: {
      type: 'listing_rejected',
      action: 'navigate_to_listing',
      listingId: '{{listingId}}',
    },
  },
  
  paymentSuccess: {
    title: 'Ödeme Başarılı 💳',
    body: '{{amount}}₺ tutarındaki ödemeniz başarıyla tamamlandı.',
    data: {
      type: 'payment_success',
      action: 'navigate_to_payment_success',
      amount: '{{amount}}',
      transactionId: '{{transactionId}}',
    },
  },
  
  paymentFailed: {
    title: 'Ödeme Başarısız ❌',
    body: '{{amount}}₺ tutarındaki ödemeniz başarısız oldu.',
    data: {
      type: 'payment_failed',
      action: 'navigate_to_payment',
      amount: '{{amount}}',
      error: '{{error}}',
    },
  },
  
  newFollower: {
    title: 'Yeni Takipçi 👥',
    body: '{{followerName}} sizi takip etmeye başladı.',
    data: {
      type: 'new_follower',
      action: 'navigate_to_profile',
      followerId: '{{followerId}}',
    },
  },
  
  promotion: {
    title: 'Özel Kampanya 🎯',
    body: '{{promotionTitle}} - {{promotionDescription}}',
    data: {
      type: 'promotion',
      action: 'navigate_to_promotion',
      promotionId: '{{promotionId}}',
    },
  },
  
  systemMaintenance: {
    title: 'Sistem Bakımı 🔧',
    body: 'Sistemimiz {{duration}} süreyle bakımda olacak.',
    data: {
      type: 'system_maintenance',
      action: 'show_maintenance_info',
      duration: '{{duration}}',
    },
  },
};

// FCM API endpoints
export const FCM_ENDPOINTS = {
  send: 'https://fcm.googleapis.com/fcm/send',
  subscribe: 'https://iid.googleapis.com/iid/v1:batchAdd',
  unsubscribe: 'https://iid.googleapis.com/iid/v1:batchRemove',
};

// Notification priority levels
export const NOTIFICATION_PRIORITY = {
  high: 'high',
  normal: 'normal',
  low: 'low',
};

// Notification sound files (Android)
export const NOTIFICATION_SOUNDS = {
  default: 'default',
  message: 'message.mp3',
  payment: 'payment.mp3',
  promotion: 'promotion.mp3',
  alert: 'alert.mp3',
}; 