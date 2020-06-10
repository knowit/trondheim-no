var cacheNames = ['external-resources'];
var locationUrlsToPrefetch = []

function createImageUrl(noApiUrl, static = true) {
  var parameters = noApiUrl.substr(noApiUrl.indexOf("?") + 1)
  var result = `../maps/${parameters.trim(' ')}.png`
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

      // Fetch static map urls from stored file
      fetch(`../external/locations.txt`, { mode: 'no-cors' })
        .then(response => response.text())
        .then(text => text.split('\n'))
        .then(mapUrls => {

          console.log('Service Worker: Caching Static Google Maps');

          mapUrls.filter(mapUrl => mapUrl.length > 3).map(function (mapUrl) {

            var path = createImageUrl(mapUrl)
            const request = new Request(path, { mode: 'no-cors' })

            fetch(path, { mode: 'no-cors' })
              .then(response => {
                cache.put(request, response)
              })

          })
        })
    })
  );
});


function redirect(request) {
  if (request.url.indexOf(`maps.googleapis.com/maps/api/staticmap`) > -1) {
    // Redirect to cached static map image
    var path = createImageUrl(removeApiKey(request.url))
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
