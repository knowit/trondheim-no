// --------------------------------------------------------------------------

var cacheNames = ['trd-events'];
const trdEventsFetchUrl = `/trdEvents`
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

async function initDatabase(data) {
  console.log("Initializing IndexedDB...")

  var request = await self.indexedDB.open('TRD_EVENTS', 1)

  request.onsuccess = function (event) {
    console.log('[onsuccess]', request.result);

    var db = event.target.result; // === request.result
    var transaction = db.transaction('event', 'readwrite');

    transaction.onsuccess = function (event) {
      console.log('[Transaction] Transaction complete');
    };

    var objectStore = transaction.objectStore('event');

    data
      .map(item => {
        delete item['repetitions']
        return item
      })
      .map(item => {
        var db_op_req = objectStore.add(item); // IDBRequest
        db_op_req.onsuccess = function (event) {
          console.log(event.target.result == item.event_slug); // true
        };
      })
  };

  request.onerror = function (event) {
    console.log('[onerror]', request.error);
  };

  request.onupgradeneeded = function (event) {
    // create object store from db or event.target.result
    var db = event.target.result;
    var store = db.createObjectStore('event', { keyPath: 'event_slug' });
    store.createIndex('event_slug_unqiue', 'event_slug', { unique: true })
  };
}


async function cacheEventImages(data, cache) {
  data.map(async function (item) {
    const request = new Request(item.imageURL)
    const response = await fetch(item.imageURL, { mode: 'no-cors' })
    cache.put(request, response)
  })
}


async function fetchTrdEventsJson(cache, forceUpdate = false) {

  console.log("Fetching trd-events...")
  const request = new Request(trdEventsUrl)
  const response = await cache.match(request, { ignoreSearch: true })
  const timestamp = await checkTrdEventsTimestamp()

  if (response && timestamp && !forceUpdate) {
    console.log("Retrieved cached trd-events.")
    return await response.json()
  }

  else {
    const res = await fetch(`${trdEventsUrl}${trdEventsUrlParameters}`)
    console.log("Fetch trd-events complete.")
    cache.put(request, res.clone())

    const result = await res.clone().json()
    setTrdEventsTimestamp()
    cacheEventImages(result, cache)
    return result
  }
}


async function getTrdEvents() {
  const cache = await caches.open(cacheNames)
  const data = await fetchTrdEventsJson(cache)
  return data.map(item => {
    delete item['repetitions']
    return item
  })
}


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {
      console.log("Service Worker: Installing")
      fetchTrdEventsJson(cache)
    })
  );
});


self.addEventListener('fetch', function (event) {

  console.log('Service Worker: Fetching ');

  event.request.url.includes(trdEventsFetchUrl) ? event.respondWith(getTrdEvents())

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