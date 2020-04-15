
// Force development builds
workbox.setConfig({ debug: true });
// The most verbose - displays all logs.
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);


var cacheNames = ['external-resources'];
var urlsToPrefetch = [
  'https://www.trondheim.no/images/severdig/bryggene-2.png',
  'https://www.trondheim.no/images/severdig/bryggene-3.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      console.log('Service Worker: Caching Files');

      urlsToPrefetch.map(function (urlToPrefetch) {
        console.log(urlToPrefetch);
        const request = new Request(urlToPrefetch, { mode: 'no-cors' });
        // Assume `cache` is an open instance of the Cache class.
        fetch(request).then(response => cache.put(request, response));
      })
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetching');
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
  );
});