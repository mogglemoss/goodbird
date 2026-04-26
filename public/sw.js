// goodbird service worker — vanilla, no Workbox.
// Caches app shell + media (xeno-canto / Wikipedia / iNaturalist) for offline use.
//
// Bump APP_VERSION when shipping changes that should invalidate cached app shell.
// MEDIA_CACHE is intentionally unversioned so already-downloaded clips persist.

const APP_VERSION = "v1";
const APP_CACHE = `goodbird-app-${APP_VERSION}`;
const MEDIA_CACHE = "goodbird-media";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/apple-touch-icon.svg",
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
self.addEventListener("message", async (event) => {
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
          const res = await fetch(url, { mode: "no-cors" });
          await cache.put(url, res);
        }
      } catch (e) {
        failed++;
      }
      done++;
      event.source?.postMessage({ type: "PRECACHE_PROGRESS", done, total: urls.length, failed });
    }
    event.source?.postMessage({ type: "PRECACHE_DONE", failed });
  }

  if (event.data?.type === "CLEAR_MEDIA_CACHE") {
    await caches.delete(MEDIA_CACHE);
    event.source?.postMessage({ type: "MEDIA_CACHE_CLEARED" });
  }
});
