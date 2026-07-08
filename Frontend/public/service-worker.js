const CACHE_NAME = "matjarna-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
];

const API_CACHE_NAME = "matjarna-api-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.origin === location.origin) {
    if (url.pathname.startsWith("/static/")) {
      event.respondWith(
        caches.match(request).then((cached) => {
          const fetched = fetch(request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          });
          return cached || fetched;
        })
      );
      return;
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      event.respondWith(
        caches.match(request).then((cached) => {
          return cached || fetch(request);
        })
      );
      return;
    }
  }

  if (url.href.includes(process.env.REACT_APP_API_URL || "e-commerce-fullstack")) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(API_CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
