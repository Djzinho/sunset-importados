const CACHE='sunset-pwa-v4';
const CORE=[
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/assets/styles-1.css',
  '/assets/styles-mobile.css',
  '/assets/styles-mobile-pwa.css',
  '/assets/styles-cinematic.css',
  '/assets/styles-product-rail.css',
  '/assets/styles-responsive-final.css',
  '/assets/app.js',
  '/assets/pwa.js',
  '/assets/media/iphone-17-pro-max-user-v3.b64',
  '/assets/media/apple-ecosystem-user-v3.b64',
  '/assets/sunset-logo.webp',
  '/assets/whatsapp.svg',
  '/assets/pwa-icon-192.png',
  '/assets/pwa-icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
        return res;
      }).catch(async()=>await caches.match(req)||await caches.match('/offline.html'))
    );
    return;
  }

  event.respondWith(
    fetch(req).then(res=>{
      if(res && res.status===200){
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
      }
      return res;
    }).catch(()=>caches.match(req))
  );
});
