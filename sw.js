const CACHE = "laptap-v27";
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener("message", event => {
  if(event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

async function reloadClients(){
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  await Promise.all(windows.map(async client => {
    try{
      if(typeof client.navigate === "function"){
        const next = await client.navigate(client.url);
        if(next) return;
      }
    }catch{}
    try{ client.postMessage({ type: "laptap-reload" }); }catch{}
  }));
}

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const stale = keys.filter(key => key !== CACHE);
    await Promise.all(stale.map(key => caches.delete(key)));
    await self.clients.claim();
    await reloadClients();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;
  if(url.pathname.endsWith("/sw.js")) return;

  const bypassCache = url.searchParams.has("u");
  event.respondWith(
    fetch(req).then(res => {
      if(res && res.ok && !bypassCache){
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req).then(cached => {
        if(cached) return cached;
        if(req.mode === "navigate"){
          return caches.match("./index.html").then(page => page || caches.match("./"));
        }
      })
    )
  );
});
