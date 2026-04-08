const CACHE_NAME = 'omniverse-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './narrative.js',
  './engine.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Mengambil dari cache, jika gagal mencoba dari jaringan
      return response || fetch(event.request);
    })
  );
});

// Membersihkan cache lama jika ada versi baru
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
});
