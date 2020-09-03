// --------------------------------------------------------------------------

var cacheNames = ["trd-events"]
const trdEventsUrl = `https://us-central1-trdevents-224613.cloudfunctions.net/getNextEvents`
const trdEventsUrlParameters = `?numEvents=20`
const timeIntervalInMinutes = 60
const timeoutInMillis = 1000 * 60 * timeIntervalInMinutes

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function checkTrdEventsTimestamp(timeout) {
  console.log("Checking trd-events timestamp...")
  const timestamp = await idbKeyval.get("trd-events-timestamp")
  return timestamp
    ? new Date(Date.now()).getTime() - new Date(timestamp).getTime() < timeout
    : false
}

async function setTrdEventsTimestamp() {
  console.log("Setting trd-events timestamp...")
  await idbKeyval.set("trd-events-timestamp", Date.now())
  console.log("Timestamp set.")
  return
}

async function trdEventsIsCached(timeout = null) {
  console.log("Checking cache for trdevents...")
  const response = await caches.match(trdEventsUrl, { ignoreSearch: true })
  console.log(
    response ? "trd-events found in cache." : "trd-events not in cache."
  )

  const timestampOk =
    response && timeout != null
      ? await checkTrdEventsTimestamp(timeout)
      : response != null

  if (response && timeout != null) {
    console.log(
      timestampOk
        ? "Cached trd-events are up to date."
        : "Cached trd-events are outdated."
    )
  }
  return response && timestampOk
}

async function getCachedTrdEvents() {
  console.log("Retrieving trd-events from cache...")
  const response = await caches.match(trdEventsUrl, { ignoreSearch: true })
  if (response) {
    console.log("Retrieved trd-events from cache successfully.")
    return response
  } else {
    throw Error(
      "Attempted to retrieve trd-events from cache, but the data has not been cached."
    )
  }
}

async function cacheEventImages(response, cache) {
  console.log("Caching all trd-events images for offline use...")
  const data = await response.json()
  await Promise.all(
    data.map(async function (item) {
      const req = new Request(item.imageURL)
      console.log(`Fetching image resource at ${item.imageURL}...`)
      const res = await fetch(item.imageURL, { mode: "no-cors" })
      cache.put(req, res)
      console.log("Cached image resource.")
      return
    })
  )
  console.log("trd-events is now available offline!")
  return
}

async function cacheTrdEvents(response) {
  console.log("Caching trd-events...")
  const cache = await caches.open(cacheNames)
  const request = new Request(trdEventsUrl)
  const res = response.clone()
  cache.put(request, response)
  console.log("trd-events were cached successfully.")
  await setTrdEventsTimestamp()
  cacheEventImages(res, cache)
  return
}

async function fetchTrdEvents() {
  console.log("Fetching trdevents.no...")
  const response = await fetch(`${trdEventsUrl}${trdEventsUrlParameters}`)
  if (!response.ok) {
    throw Error(
      `Response received from trdevents came with status: ${response.statusText}`
    )
  }
  const res = response.clone()
  console.log("Response recieved from trdevents.no.")
  cacheTrdEvents(res)
  return response
}

// Aner ikke om dette funker
async function waitForCachedTrdEvents() {
  console.log("Checking cache for trd-events...")
  var isCached = await trdEventsIsCached()

  while (!isCached) {
    console.log("Waiting for trd-events to appear in cache...")
    await sleep(500)
    isCached = await trdEventsIsCached(timeoutInMillis)
  }

  return getCachedTrdEvents()
}

async function getTrdEvents() {
  console.log("Retrieving trd-events...")
  const isCached = await trdEventsIsCached(timeoutInMillis)
  return isCached
    ? getCachedTrdEvents()
    : Promise.race([waitForCachedTrdEvents(), fetchTrdEvents()])
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheNames).then(function (cache) {
      console.log("Service Worker: Installing")
      getTrdEvents().then(() => {})
    })
  )
})

self.addEventListener("fetch", function (event) {
  console.log("Service Worker: Fetching ")

  event.request.url.includes(trdEventsUrl)
    ? event.respondWith(getTrdEvents())
    : event.respondWith(
        caches.match(event.request).then(function (response) {
          // Cache hit - return response
          if (response) {
            return response
          }
          return fetch(event.request)
        })
      )
})

self.addEventListener("message", async (event) => {
  if (event.data === "onappinstalled") {
    console.log(`App was installed. Precaching pages...`)
    const precacheFiles = self.__WB_MANIFEST

    const cache = await caches.open(workbox.core.cacheNames.runtime)

    // Add chunks of pages to cache at once
    const chunkSize = 600
    var startIndex = 0
    var stopIndex = Math.min(chunkSize, precacheFiles.length)
    while (startIndex < precacheFiles.length) {
      console.log(`Caching pages: ${startIndex}/${precacheFiles.length}`)

      const precacheChunk = precacheFiles.slice(startIndex, stopIndex)
      await cache.addAll(
        precacheChunk.map((file) => {
          return `/${file.url}`
        })
      )

      startIndex = stopIndex
      if (stopIndex < precacheFiles.length) {
        stopIndex = Math.min(stopIndex + chunkSize, precacheFiles.length)
      }
    }

    console.log("Caching of pages successful.")
  }
})
