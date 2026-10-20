/* Permette di installare l'app e di aprirla anche senza rete (usa l'ultima versione scaricata). */
const C = 'compensi-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== C) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith((async () => {
    try {
      const r = await fetch(e.request);
      if (r.ok) { const c = await caches.open(C); c.put(e.request, r.clone()); }
      return r;
    } catch (x) {
      const m = await caches.match(e.request);
      if (m) return m;
      throw x;
    }
  })());
});
