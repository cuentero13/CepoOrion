// Service worker mínimo de CEPO: offline básico para conectividad limitada.
// Estrategia: cache-first para recursos estáticos, network-first para páginas,
// con fallback a /sin-conexion cuando no hay red.
// CACHE v2 (22-nov-2026): la v1 podía guardar páginas de /admin y /progreso
// y reservirlas sin conexión tras cerrar sesión en un dispositivo compartido
// (revisión de seguridad). Al subir la versión, el activate borra la v1.
const CACHE = "cepo-v2";
const ESTATICOS = ["/", "/manifest.webmanifest", "/icons/icon-192.svg", "/icons/icon-512.svg"];

// Rutas con datos privados: el panel (/admin) y el progreso personal.
// Nunca se guardan en la caché ni se sirven desde ella.
const PRIVADO = ["/admin", "/progreso"];

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
    // Las rutas privadas no se cachean ni se sirven desde la caché:
    // sin conexión muestran /sin-conexion en vez de datos viejos de
    // otra sesión.
    const esPrivado = PRIVADO.some(
      (ruta) => url.pathname === ruta || url.pathname.startsWith(ruta + "/")
    );
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (!esPrivado) {
            const copia = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copia));
          }
          return res;
        })
        .catch(() =>
          esPrivado
            ? caches.match("/sin-conexion")
            : caches.match(request).then((r) => r || caches.match("/sin-conexion"))
        )
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
