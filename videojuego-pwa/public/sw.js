const CACHE_NAME = "game-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/src/index.css",
  "/src/main.jsx",
  "/src/App.jsx"
];

//  1. Instalar el Service Worker y guardar archivos en caché
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

//  2. Activar y limpiar cachés viejas
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ 3. Interceptar peticiones
self.addEventListener("fetch", (event) => {
  // Solo manejamos peticiones GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si ya está en caché, lo regresamos
      if (response) {
        return response;
      }

      // Si no está, lo buscamos de la red y lo guardamos
      return fetch(event.request)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
        .catch(() => {
          // Si falla todo (ej: offline), y es la raíz, regresamos el index.html
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
