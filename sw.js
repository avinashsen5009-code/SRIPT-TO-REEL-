const C='reel-v38',P=['./','index.html','structural-minimalism.css','editor-sheets.css','reel-renderer-minimalism.js','reel-director.js','visual-grammar.js','visual-layout.js','pacing.js','caption-phrase.js','motion-direction.js','editorial-visuals.js','story-director.js','story-style.js','scene-graph.js','explainer-style.js','self-improvement.js','educational-components.js','metaphor-props.js','explainer-self-test.html','manifest.json','icon.svg','fonts.css'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
const c=await caches.open(C);
await Promise.all(P.map(u=>c.add(u).catch(()=>{})));
try{const b=new URL('fonts.css',location.href),r=await fetch(b);if(r.ok){const t=await r.text();
await Promise.all([...t.matchAll(/url\(([^)]+)\)/g)].map(m=>c.add(new URL(m[1].replace(/["']/g,''),b).href).catch(()=>{})))}}catch(x){}
self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(/\/models\//.test(u.pathname))return;
if(e.request.method!=='GET'||!(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.host)))return;
e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)))});
