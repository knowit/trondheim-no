self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(
        [
          'https://trondheim.no/images/severdig/bryggene-2.png',
        ]
      );
    })
  );
});