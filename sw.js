/* SphereCam service worker — network-first with offline fallback.
   New versions install in the background and WAIT until the user taps
   "Update ready — tap to restart" (the page then posts SKIP_WAITING). */
const CACHE = 'spherecam-v10';
const CORE = ['.', 'index.html', 'manifest.webmanifest', 'opencv.js',
              'icon-192.png', 'icon-512.png', 'icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() =>
      caches.match(e.request).then(r => r || caches.match('index.html'))
    )
  );
});
