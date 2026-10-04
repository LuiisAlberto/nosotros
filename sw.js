/* Guarda una copia del disco para que abra rápido y sin señal.
   Siempre intenta primero la versión nueva de internet. */
const CACHE = "nosotros-v12";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.status === 200) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request))
  );
});
