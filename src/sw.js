const cacheName = 'pages-cache-v1';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("Cached stuff")
      return cache.addAll(
        [
          '/severdig/bryggene',
        ]
      );
    }

    )
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});