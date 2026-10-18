const C='reel-v1',P=['./','index.html','manifest.json','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(P)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(e.request.method!=='GET'||!(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.host)))return;
e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)))});
