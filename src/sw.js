
var static_urls = [
  'https://trondheim.no/images/severdig/bryggene-2.png',
  'https://trondheim.no/images/severdig/bryggene-3.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('external-cache').then(function (cache) {
      cache.addAll(static_urls.map(function (urlToPrefetch) {
        console.log(urlToPrefetch);
        return new Request(urlToPrefetch, { mode: 'cors' });
      })).catch(function (error) {
        console.error(error);
      }).then(function () {
        console.log('All fetched and cached');
      });
    })
  );
});