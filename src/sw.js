

var cacheNames = ['external-resources'];
var urlsToPrefetch = [];
var locationUrlsToPrefetch = []


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      // Fetch external image urls from stored file
      fetch(`../external/sources.txt`, { mode: 'no-cors' })
        .then(response => response.text())
        .then(text => text.split('\n'))
        .then(urlsToPrefetch => {

          console.log('Service Worker: Caching external resources');

          urlsToPrefetch.map(function (urlToPrefetch) {
            const request = new Request(urlToPrefetch, { mode: 'no-cors' });

            // Fetch individual external image url and cache it
            fetch(urlToPrefetch, {
              mode: 'no-cors',
              method: 'GET',
              headers: {
                Accept: 'image/png',
              },
            },
            ).then(response => {
              cache.put(request, response)
            })
          })
        }).then(_ => {

          // Fetch static map urls from stored file
          fetch(`../external/locations.txt`, { mode: 'no-cors' })
            .then(response => response.text())
            .then(text => text.split('\n'))
            .then(mapUrls => {


              mapUrls.filter(mapUrl => mapUrl.length > 3).map(function (mapUrl) {

                var urlObject = new URL(mapUrl)
                var path = `../maps/center=${decodeURI(urlObject.searchParams.get("center"))}.png`
                const request = new Request(path, { mode: 'no-cors' })

                fetch(path, { mode: 'no-cors' })
                  .then(response => {
                    console.log(`Chaching\nRequest: ${request.url}\nResponse:${JSON.stringify(response.body.json())}\n\n`)
                    cache.put(request, response)
                  })

              })
            })
        })
        .catch(error => console.error(error));
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetching ');
  var mapFound = false
  if (event.request.url.indexOf(`maps.googleapis.com/maps/api/staticmap`) > -1) {


    var urlObject = new URL(event.request.url)
    var path = `../maps/center=${decodeURI(urlObject.searchParams.get("center"))}.png`

    var request = new Request(path, { mode: 'no-cors' })

    console.log(`Fetching: ${path}`)

    event.respondWith(
      caches.match(request)
        .then(function (response) {
          // Cache hit - return response
          if (response) {
            console.log(response)
            mapFound = true
            return response;
          }
        }
        )
    );
  }

  if (!mapFound) {
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
  }
});
