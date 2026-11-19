// Service worker mínimo de CEPO: offline básico para conectividad limitada.
// Estrategia: cache-first para recursos estáticos, network-first para páginas,
// con fallback a /sin-conexion cuando no hay red.
const CACHE = "cepo-v1";
const ESTATICOS = ["/", "/manifest.webmanifest", "/icons/icon-192.svg", "/icons/icon-512.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ESTATICOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/sin-conexion")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cacheada) =>
        cacheada ||
        fetch(request).then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copia));
          return res;
        })
    )
  );
});
