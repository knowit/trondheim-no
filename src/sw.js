

var CACHE_NAME = 'my-site-cache-v1';
var urlsToPrefetch = [
  'https://www.trondheim.no/images/severdig/bryggene-2.png',
  'https://www.trondheim.no/images/severdig/bryggene-3.png'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        // Magic is here. Look the  mode: 'no-cors' part.
        cache.addAll(urlsToPrefetch.map(function (urlToPrefetch) {
          return new Request(urlToPrefetch, { mode: 'no-cors' });
        })).then(function () {
          console.log('All resources have been fetched and cached.');
        });
      })
  );
});