// Web Share API + clipboard fallback. Caller doesn't care which path fires;
// the returned result tells the UI whether to show a "Link copied" toast.

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export type ShareResult = "shared" | "copied" | "dismissed" | "failed";

export async function tryShare(data: ShareData): Promise<ShareResult> {
  // Native OS share sheet (iOS Safari, Android Chrome, Edge, Safari 17+,
  // recent Chrome on desktop). Lets the user pick any installed app.
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(data);
      return "shared";
    } catch (e: unknown) {
      // User dismissed the share sheet — that's a valid no-op, not an error.
      if (e instanceof Error && e.name === "AbortError") return "dismissed";
      // Other errors fall through to clipboard.
    }
  }
  // Fallback: copy URL to clipboard so the user can paste it themselves.
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(data.url);
      return "copied";
    }
  } catch {
    /* ignore */
  }
  return "failed";
}
