// --------------------------------------------------------------------------

var cacheNames = ['trd-events'];
const trdEventsUrl = `https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents`
const trdEventsUrlParameters = `?numEvents=20`
const timeIntervalInMinutes = 60
const timeoutInMillis = 1000 * 60 * timeIntervalInMinutes


async function checkTrdEventsTimestamp() {

  const timestamp = await idbKeyval.get('trd-events-timestamp')
  return timestamp ? (new Date(Date.now())).getTime() - (new Date(timestamp)).getTime() < timeoutInMillis : false
}

async function setTrdEventsTimestamp() {
  await idbKeyval.set('trd-events-timestamp', Date.now())
}


async function cacheEventImages(data, cache) {
  data.map(async function (item) {
    const request = new Request(item.imageURL)
    const response = await fetch(item.imageURL, { mode: 'no-cors' })
    cache.put(request, response)
  })
}


async function fetchTrdEvents(cache, forceUpdate = false) {

  console.log("Fetching trd-events...")
  const request = new Request(trdEventsUrl)
  const response = await cache.match(request, { ignoreSearch: true })
  const timestamp = await checkTrdEventsTimestamp()

  if (response && timestamp && !forceUpdate) {
    console.log("Retrieved cached trd-events.")
    return response
  }

  else {
    const res = await fetch(`${trdEventsUrl}${trdEventsUrlParameters}`)
    console.log("Fetch trd-events complete.")
    cache.put(request, res.clone())

    const result = await res.clone().json()
    setTrdEventsTimestamp()
    cacheEventImages(result, cache)
    return res
  }
}


async function getTrdEvents() {
  const cache = await caches.open(cacheNames)
  return await fetchTrdEvents(cache)
}


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {
      console.log("Service Worker: Installing")
      fetchTrdEvents(cache)
    })
  );
});


self.addEventListener('fetch', function (event) {

  console.log('Service Worker: Fetching ');

  event.request.url.includes(trdEventsUrl) ? event.respondWith(getTrdEvents())

    : event.respondWith(
      caches.match(event.request)
        .then(function (response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        }))
});