var cacheNames = ['external-resources'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      console.log("Service Worker: Installing")

    })
  );
});


self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetching ');

  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  )
});
