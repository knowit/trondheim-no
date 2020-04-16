
var cacheNames = ['external-resources'];
var urlsToPrefetch = [];

const query = `query{allFlamelinkArticleContent{edges{node{title}}}}`


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      fetch(`../external/sources.txt`, { mode: 'no-cors' })
        .then(response => response.text())
        .then(text => {
          urlsToPrefetch = text.split('\n')
        })
        .then(_ => {

          console.log(urlsToPrefetch)

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
        .catch(error => console.error(error));
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