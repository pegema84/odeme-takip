const CACHE="odeme-takip-v1.2";
const FILES=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
// Önce ağdan dene; yalnızca BAŞARILI (200) cevapları önbelleğe yaz.
// Ağ yoksa ya da site kapandıysa (404 vb.) önbellekteki kopya açılır.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith((async()=>{
    try{
      const r=await fetch(e.request);
      if(r&&r.ok){const c=await caches.open(CACHE);c.put(e.request,r.clone())}
      else{const m=await caches.match(e.request,{ignoreSearch:true});if(m)return m}
      return r;
    }catch(err){
      return (await caches.match(e.request,{ignoreSearch:true}))||(await caches.match("./index.html"));
    }
  })());
});
