const CACHE_NAME = 'omniverse-core-v5'; // Ubah angka ini setiap deploy besar

// Bypass siklus tunggu, langsung instal versi baru
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Hancurkan cache era lama tanpa ampun
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                          .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim(); // Ambil alih kontrol seketika
});

// Strategi: Network-First, Fallback to Cache
// WHY: Menjamin Anda selalu mendapat kode terbaru dari GitHub saat online.
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Jika sukses dari jaringan, simpan salinannya ke cache
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Jika offline (tidak ada sinyal), baru pakai cache
                return caches.match(event.request);
            })
    );
});
