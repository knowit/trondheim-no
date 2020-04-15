
var cacheNames = ['external-resources'];
var urlsToPrefetch = [
  'https://firebasestorage.googleapis.com/v0/b/trondheimno-demo.appspot.com/o/flamelink%2Fmedia%2Fbryggene-1.png?alt=media&token=d9969a07-2c01-49dd-8b55-47c03327704c',
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
        fetch(urlToPrefetch, {
          mode: 'no-cors',
          method: 'GET',
          headers: {
            Accept: 'image/png',
          },
        },
        ).then(response => {
          cache.put(request, response)
          console.log(response)
        });
      })
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetching ');
  console.log(event.request)
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          console.log("Response:")
          console.log(response)
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});