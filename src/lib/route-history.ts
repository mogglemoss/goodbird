/**
 * Tiny in-memory route trail. Populated by RouteTracker on every pathname
 * change; read by FeedbackDialog at submit time so bug reports include
 * the user's last few pages, not just whichever page they happened to be
 * on when they tapped Send.
 */

const MAX = 10;
const history: string[] = [];

export function recordRoute(pathname: string) {
  // Skip duplicates back-to-back (HMR or React StrictMode double-render).
  if (history[history.length - 1] === pathname) return;
  history.push(pathname);
  if (history.length > MAX) history.shift();
}

export function getRouteHistory(): string[] {
  return [...history];
}
