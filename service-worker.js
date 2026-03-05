const CACHE_NAME = "auditoria-pwa-v3";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./historico.html",
  "./dashboard.html",
  "./reporte.html",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );

});

self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        if (response) {
          return response;
        }

        return fetch(event.request).then(networkResponse => {

          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

        });

      })

  );

});
