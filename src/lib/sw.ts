// Service-worker registration + offline-precache helper.
// In dev we deliberately skip registration so HMR isn't fighting with cached assets.

export function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  if (import.meta.env.DEV) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("SW registration failed", err);
    });
  });
}

export interface PrecacheProgress {
  done: number;
  total: number;
  failed: number;
}

export async function precacheUrls(
  urls: string[],
  onProgress?: (p: PrecacheProgress) => void,
): Promise<PrecacheProgress> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported in this browser.");
  }
  const reg = await navigator.serviceWorker.ready;
  const sw = reg.active;
  if (!sw) throw new Error("No active service worker. Reload and try again.");

  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    let last: PrecacheProgress = { done: 0, total: urls.length, failed: 0 };
    channel.port1.onmessage = (e) => {
      if (e.data?.type === "PRECACHE_PROGRESS") {
        last = { done: e.data.done, total: e.data.total, failed: e.data.failed };
        onProgress?.(last);
      } else if (e.data?.type === "PRECACHE_DONE") {
        resolve({ ...last, failed: e.data.failed ?? last.failed });
      }
    };
    setTimeout(() => reject(new Error("Precache timed out")), 10 * 60 * 1000);
    sw.postMessage({ type: "PRECACHE_URLS", urls }, [channel.port2]);
  });
}

export async function clearMediaCache(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  return new Promise((resolve) => {
    if (!reg.active) return resolve();
    const channel = new MessageChannel();
    channel.port1.onmessage = (e) => {
      if (e.data?.type === "MEDIA_CACHE_CLEARED") resolve();
    };
    reg.active.postMessage({ type: "CLEAR_MEDIA_CACHE" }, [channel.port2]);
    setTimeout(resolve, 5000); // safety fallback
  });
}

export async function countCachedMedia(): Promise<number | null> {
  if (!("serviceWorker" in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  if (!reg.active) return null;
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (e) => {
      if (e.data?.type === "CACHED_COUNT") resolve(e.data.count ?? 0);
    };
    reg.active!.postMessage({ type: "COUNT_CACHED" }, [channel.port2]);
    setTimeout(() => resolve(null), 3000);
  });
}

/**
 * Drop a single URL from the media cache. Best-effort and synchronous-feeling
 * — fire-and-forget; we don't await it from audio.ts. If the SW isn't ready
 * (very early in the session, or in dev where SW is skipped), this is a noop.
 */
export function invalidateCachedUrl(url: string): void {
  if (!("serviceWorker" in navigator)) return;
  const sw = navigator.serviceWorker.controller;
  if (!sw) return;
  try {
    sw.postMessage({ type: "INVALIDATE_URL", url });
  } catch {
    /* ignore — best effort */
  }
}

export async function estimateCacheBytes(): Promise<number | null> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) return null;
  const est = await navigator.storage.estimate();
  return est.usage ?? null;
}
