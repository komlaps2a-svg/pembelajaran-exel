const CACHE_NAME = 'omniverse-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/narrative.js',
  '/js/engine.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
