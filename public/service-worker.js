const CACHE_NAME = "budget-tracker-static-v1";
const DATA_CACHE_NAME = "budget-tracker-data-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/index.js",
  "/js/idb.js",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  // Take control of uncontrolled clients immediately
  self.clients && self.clients.claim && self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(e.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(e.request.url, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(e.request));
      }),
    );
    return;
  }

  // Navigation requests: return cached index.html (SPA fallback)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html').then((response) => {
        return response || fetch(e.request).catch(() => caches.match('/index.html'));
      }),
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    }),
  );
});
