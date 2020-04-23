import fetch from "node-fetch";

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


              mapUrls.map(function (mapUrl) {

                var urlObject = new URL(mapUrl)
                var path = `../static/maps/center=${urlObject.searchParams.get("center")}.png`

                fetch(path, { mode: 'no-cors' })
                  .then(response => {
                    console.log(response)
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
