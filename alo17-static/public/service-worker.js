const CACHE_NAME = 'alo17-cache-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/offline.html',
  '/styles/globals.css',
  '/images/logo.svg',
  '/icons/notification-icon.png',
  '/icons/notification-badge.png',
];

// Service Worker kurulumu
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ağ isteklerini yakala
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache'de varsa cache'den döndür
        if (response) {
          return response;
        }

        // Cache'de yoksa ağdan al ve cache'e ekle
        return fetch(event.request)
          .then((response) => {
            // Geçersiz yanıt veya OPTIONS isteği ise cache'leme
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method === 'OPTIONS') {
              return response;
            }

            // Yanıtı cache'e ekle
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Ağ hatası durumunda offline sayfasını göster
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Cache temizleme
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 