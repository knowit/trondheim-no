workbox.routing.registerRoute(
  new RegExp('^https://trondheim.no/images/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp('^https://firebasestorage.googleapis.com/v0/b/trondheimno-demo.appspot.com/o/flamelink%2Fmedia%2F'),
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      })
    ]
  })
);


