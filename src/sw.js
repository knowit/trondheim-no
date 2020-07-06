// --------------------------------------------------------------------------

var cacheNames = ['trd-events'];
const trdEventsUrl = `https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents`

async function fetchTrdEventsJson(forceUpdate = false) {

  console.log("Fetching trd-events...")
  const cache = await caches.open(cacheNames)
  const request = new Request(trdEventsUrl)
  const response = await cache.match(request)

  if (response && !forceUpdate) {
    console.log("Retrieved cached trd-events.")
    return await response.json()
  }

  else {

    const res = await fetch(request)
    console.log("Fetch trd-events complete.")
    cache.put(request, res)
    return await res.json()
  }
}


function initDatabase(data) {
  console.log("Initializing IndexedDB...")

  var request = self.indexedDB.open('TRD_EVENTS', 1)

  request.onsuccess = function (event) {
    console.log('[onsuccess]', request.result);

    var db = event.target.result; // === request.result
    var transaction = db.transaction('event', 'readwrite');
    var varsTransaction = db.transaction('vars', 'readwrite');

    transaction.onsuccess = function (event) {
      console.log('[Transaction] Transaction complete');
    };
    varsTransaction.onsuccess = function (event) {
      console.log('[VarsTransaction] Transaction complete');
    };

    var objectStore = transaction.objectStore('event');

    var varsStore = varsTransaction.objectStore('vars');

    data.filter(item => item.eventCancelled === false)
      .slice(0, 10)
      .map(item => {
        var db_op_req = objectStore.add(item); // IDBRequest
        db_op_req.onsuccess = function (event) {
          console.log(event.target.result == item.event_slug); // true
        };
      })

    var date_remove_req = varsStore.delete('date')
    date_remove_req.onsuccess = function (event) {
      console.log('Removed timestamp');
    };

    var date_add_req = varsStore.add({ name: 'date', value: Date.now() })
    date_add_req.onsuccess = function (event) {
      console.log('Added timestamp');
    };
  };

  request.onerror = function (event) {
    console.log('[onerror]', request.error);
  };

  request.onupgradeneeded = function (event) {
    // create object store from db or event.target.result
    var db = event.target.result;
    var store = db.createObjectStore('event', { keyPath: 'event_slug' });
    store.createIndex('event_slug_unqiue', 'event_slug', { unique: true })

    var store = db.createObjectStore('vars', { keyPath: 'name' });

  };

}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      console.log("Service Worker: Installing")
      fetchTrdEventsJson().then(data => initDatabase(data))
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
  )
});