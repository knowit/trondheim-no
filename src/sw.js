var cacheNames = ['external-resources', 'trd-events'];
const trdEventsUrl = `https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents`

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {

      console.log("Service Worker: Installing")

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

const checkRequestAge = (request, timeRange) => {
  
}


const fetchTrdEvents = async (req = null) => {
  const cache = await caches.open('trd-events')
  const response = await fetch(trdEventsUrl)

}
