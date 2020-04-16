
var cacheNames = ['external-resources'];
var urlsToPrefetch = [];
var locationUrlsToPrefetch = []

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
          console.log('Service Worker: Caching external resources');

          urlsToPrefetch.map(function (urlToPrefetch) {
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
            }).then(_ => {

              fetch(`../external/locations.txt`, { mode: 'no-cors' })
                .then(response => response.text())
                .then(text => {
                  var object = JSON.parse(text)
                  object.map(entry => {
                    var baseURL = "https://www.google.com/maps/search/?api=1"
                    if (entry.address) {
                      locationUrlsToPrefetch.push(baseURL + "&query=" + encodeURI(address))
                    } else {
                      locationUrlsToPrefetch.push(baseURL + "&query=" + entry.lat + "," + entry.lng)
                    }

                  })
                }).then(_ => {
                  console.log(locationUrlsToPrefetch)
                })
                .catch(error => console.error(error))

            });
          })
        })
        .catch(error => console.error(error));
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
  );
});