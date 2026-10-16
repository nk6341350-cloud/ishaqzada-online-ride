const CACHE_NAME = 'ishaqzada-services-v3';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './services-logo.png', './apple-touch-icon-v3.png', './app-icon-192-v3.png', './app-icon-512-v3.png', './cargo-dumper.webp', './cargo-water-tanker.webp', './worker-solar.webp', './worker-ac.webp'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('ishaqzada-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === 'navigate') return await caches.match('./index.html') || Response.error();
    return Response.error();
  }));
});
