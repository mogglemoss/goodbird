// goodbird service worker — vanilla, no Workbox.
// Caches app shell + media (xeno-canto / Wikipedia / iNaturalist) for offline use.
//
// Bump APP_VERSION when shipping changes that should invalidate cached app shell.
// MEDIA_CACHE is intentionally unversioned so already-downloaded clips persist.

const APP_VERSION = "v3";
const APP_CACHE = `goodbird-app-${APP_VERSION}`;
const MEDIA_CACHE = "goodbird-media";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/lockup.png",
  "/lockup-2x.png",
  "/lockup-compact.png",
  "/lockup-compact-2x.png",
];

const MEDIA_HOSTS = new Set([
  "xeno-canto.org",
  "upload.wikimedia.org",
  "static.inaturalist.org",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((c) => c.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("goodbird-app-") && k !== APP_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Cross-origin media — cache-first, opaque OK
  if (MEDIA_HOSTS.has(url.hostname) || url.hostname.endsWith(".xeno-canto.org")) {
    event.respondWith(cacheFirst(MEDIA_CACHE, req));
    return;
  }

  // Same-origin
  if (url.origin === self.location.origin) {
    // SPA navigation — network-first with /index.html fallback when offline
    if (req.mode === "navigate") {
      event.respondWith(
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(APP_CACHE).then((c) => c.put("/", copy)).catch(() => {});
            return res;
          })
          .catch(() => caches.match("/").then((r) => r || new Response("offline", { status: 503 })))
      );
      return;
    }
    // Built assets / static files — cache-first
    event.respondWith(cacheFirst(APP_CACHE, req));
    return;
  }
});

async function cacheFirst(cacheName, req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === "opaque")) {
      cache.put(req, res.clone()).catch(() => {});
    }
    return res;
  } catch (err) {
    if (cached) return cached;
    return new Response("offline", { status: 503 });
  }
}

// "Download for offline" — pre-cache a batch of URLs sent from the page.
// Replies go on event.ports[0] (the MessageChannel port the page transferred),
// not event.source — those are two different communication channels.
self.addEventListener("message", async (event) => {
  const port = event.ports[0] ?? null;
  const reply = (msg) => { port?.postMessage(msg); };

  if (event.data?.type === "PRECACHE_URLS") {
    const urls = Array.isArray(event.data.urls) ? event.data.urls : [];
    const cache = await caches.open(MEDIA_CACHE);
    let done = 0;
    let failed = 0;
    for (const url of urls) {
      try {
        // Skip if already cached
        const existing = await cache.match(url);
        if (!existing) {
          // Try CORS first so the cached response isn't opaque (which inflates
          // navigator.storage.estimate() to ~7 MB per entry as a side-channel
          // defense). Fall back to no-cors for origins that don't allow CORS.
          let res;
          try {
            res = await fetch(url, { mode: "cors", credentials: "omit" });
          } catch {
            res = await fetch(url, { mode: "no-cors" });
          }
          await cache.put(url, res);
        }
      } catch {
        failed++;
      }
      done++;
      reply({ type: "PRECACHE_PROGRESS", done, total: urls.length, failed });
    }
    reply({ type: "PRECACHE_DONE", failed });
  }

  if (event.data?.type === "CLEAR_MEDIA_CACHE") {
    await caches.delete(MEDIA_CACHE);
    reply({ type: "MEDIA_CACHE_CLEARED" });
  }

  if (event.data?.type === "COUNT_CACHED") {
    const cache = await caches.open(MEDIA_CACHE);
    const keys = await cache.keys();
    reply({ type: "CACHED_COUNT", count: keys.length });
  }
});
