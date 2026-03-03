const CACHE = 'scheduler-v1';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  // Network first for same-origin, cache fallback
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  }
});

// Background sync message from page
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SYNC') {
    // relay back to all clients
    self.clients.matchAll().then(cls => cls.forEach(c => c.postMessage({type:'SYNCED'})));
  }
});
