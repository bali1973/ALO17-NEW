// Service Worker for Alo17 PWA - TEMPORARILY DISABLED

console.log('Service Worker loaded but disabled for debugging');

// Install event - do nothing
self.addEventListener('install', (event) => {
  console.log('Service Worker installing... (disabled)');
  event.waitUntil(self.skipWaiting());
});

// Activate event - do nothing
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating... (disabled)');
  event.waitUntil(self.clients.claim());
});

// Fetch event - pass through
self.addEventListener('fetch', (event) => {
  // Pass through all requests without caching
  return;
}); 