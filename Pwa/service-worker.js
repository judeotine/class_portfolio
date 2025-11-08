const CACHE_NAME = 'jude-portfolio-v1';
const RUNTIME_CACHE = 'jude-portfolio-runtime-v1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './icons/arrow-down.svg',
  './icons/arrow-up.svg',
  './icons/arrow-left.svg',
  './icons/arrow-right.svg',
  './icons/email.svg',
  './icons/location.svg',
  './icons/github.svg',
  './icons/external-link.svg',
  './icons/quote.svg',
  './icons/monitor.svg',
  './icons/api.svg',
  './icons/mobile.svg',
  './Images/jude.jpg'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
});

