var cacheNames = ['external-resources'];
var urlsToPrefetch = [];
var locationUrlsToPrefetch = []

function createImageUrl(noApiUrl) {
  var parameters = noApiUrl.substr(noApiUrl.indexOf("?") + 1)
  var result = `../static/maps/${parameters.trim(' ')}.png`
  result = result.split(':').join(']')
  result = result.split('|').join(')')
  return result
}

function removeApiKey(apiUrl) {
  var urlObject = new URL(apiUrl)
  var searchParams = urlObject.searchParams
  searchParams.delete('key')
  urlObject.search = searchParams.toString()
  return decodeURIComponent(urlObject.toString())
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      console.log("Service Worker: Installing")

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

              console.log('Service Worker: Caching Static Google Maps');

              mapUrls.filter(mapUrl => mapUrl.length > 3).map(function (mapUrl) {

                var path = createImageUrl(mapUrl)
                console.log(path)
                const request = new Request(path, { mode: 'no-cors' })

                fetch(path, { mode: 'no-cors' })
                  .then(response => {
                    cache.put(request, response)
                  })

              })
            })
        })
        .catch(error => console.error(error));
    })
  );
});


function redirect(request) {
  if (request.url.indexOf(`maps.googleapis.com/maps/api/staticmap`) > -1) {
    // Redirect to cached static map image
    var noApiUrl = removeApiKey(request.url)
    var path = createImageUrl(removeApiKey(request.url))
    console.log(`Redirecting...\nURL: ${request.url}\nno API URL: ${noApiUrl}\nImageURL: ${path}`)
    return new Request(path, { mode: 'no-cors' })
  }
  else {
    return request
  }
}

self.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetching ');

  event.respondWith(
    caches.match(redirect(event.request))
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
