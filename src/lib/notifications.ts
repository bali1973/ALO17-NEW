import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const initNotifications = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error('Notification permission error:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});

// Bildirim türleri
export const NotificationTypes = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  LISTING_UPDATE: 'LISTING_UPDATE',
  PRICE_UPDATE: 'PRICE_UPDATE',
  PREMIUM_EXPIRY: 'PREMIUM_EXPIRY',
  LISTING_APPROVED: 'LISTING_APPROVED',
  LISTING_REJECTED: 'LISTING_REJECTED'
} as const;

// Bildirim gönderme fonksiyonu
export const sendNotification = async (userId: string, type: keyof typeof NotificationTypes, data: any) => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type,
        data
      }),
    });
    return response.json();
  } catch (error) {
    console.error('Send notification error:', error);
    throw error;
  }
}; 