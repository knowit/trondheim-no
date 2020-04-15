import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

registerRoute(
  'https://trondheim.no/images/*',
  new CacheFirst({
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  }),
);
