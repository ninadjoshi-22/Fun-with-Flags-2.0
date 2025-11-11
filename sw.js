const CACHE_NAME = 'fun-with-flags-v1';
const urlsToCache = [
  './',
  './index.html',
  './index.js',
  './App.js',
  './components/CountryDetails.js',
  './components/FinalScore.js',
  './components/Flag.js',
  './components/Options.js',
  './components/Scoreboard.js',
  './components/Timer.js',
  './constants.js',
  './types.js',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/@google/genai@^0.15.0/dist/index.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Let the browser do its default thing for non-GET requests.
  if (event.request.method !== 'GET') return;

  // Don't cache the dynamically loaded flag images
  if (event.request.url.includes('flagcdn.com')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response.
            // We don't cache opaque responses (e.g. from CDNs without CORS)
            if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
