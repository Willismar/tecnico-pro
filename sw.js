const CACHE = 'willismar-v1';
const ASSETS = [
  './',
  './index.html'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  // Para Firebase y Google Fonts, siempre red
  if(e.request.url.includes('firebase') || e.request.url.includes('googleapis')){
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached=>{
      return cached || fetch(e.request).catch(()=>caches.match('./index.html'));
    })
  );
});
