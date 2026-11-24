/* Offline-Betrieb (nur in der Website-Fassung, z. B. GitHub Pages). Hörbuch-Dateien werden beim ersten Abspielen zwischengespeichert. */
const V='atn-2';
const CORE=['./','index.html','data.js','wissen.js','audio.js','scenes.js','app.js','supabase.js','manifest.webmanifest','icon-180.png','icon-512.png','img/s1.jpg','img/s2.jpg','img/s3.jpg','img/s4.jpg','img/s5.jpg','img/s6.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='atn-audio').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(/\/audio\//.test(r.url)){if(r.headers.get('range'))return;e.respondWith(caches.open('atn-audio').then(c=>c.match(r).then(h=>h||fetch(r).then(x=>{if(x.ok&&x.status===200)c.put(r,x.clone());return x;}))));return;}
  e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y));}return x;}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match('index.html'))));
});
