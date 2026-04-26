import { Howl } from "howler";

const cache = new Map<string, Howl>();

export function getHowl(url: string): Howl {
  let h = cache.get(url);
  if (h) return h;
  h = new Howl({ src: [url], html5: true, preload: true });
  cache.set(url, h);
  return h;
}

export function preload(urls: string[]) {
  for (const u of urls) getHowl(u);
}

export function stopAll() {
  for (const h of cache.values()) h.stop();
}
