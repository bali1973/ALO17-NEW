importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: self.FIREBASE_CONFIG.apiKey,
  authDomain: self.FIREBASE_CONFIG.authDomain,
  projectId: self.FIREBASE_CONFIG.projectId,
  storageBucket: self.FIREBASE_CONFIG.storageBucket,
  messagingSenderId: self.FIREBASE_CONFIG.messagingSenderId,
  appId: self.FIREBASE_CONFIG.appId
});

const messaging = firebase.messaging();

// Arka planda bildirim alma
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/notification-icon.png',
    badge: '/icons/notification-badge.png',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Görüntüle'
      },
      {
        action: 'close',
        title: 'Kapat'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirime tıklama
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  const data = notification.data;

  notification.close();

  if (action === 'open') {
    // Bildirime tıklandığında yapılacak işlemler
    if (data.type === 'NEW_MESSAGE') {
      clients.openWindow(`/mesajlar/${data.conversationId}`);
    } else if (data.type === 'LISTING_UPDATE') {
      clients.openWindow(`/ilan/${data.listingId}`);
    }
  }
}); 