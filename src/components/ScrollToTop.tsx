import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordRoute } from "@/lib/route-history";

/**
 * React Router doesn't reset window scroll on navigation by default —
 * navigating to a new route inherits the previous page's scrollY. This
 * mounts once inside BrowserRouter and snaps to the top on every
 * pathname change. Also records the visited route into a small in-memory
 * trail used by the feedback form so bug reports include the user's
 * recent navigation context, not just the page they happened to be on
 * when they tapped Send.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    recordRoute(pathname);
  }, [pathname]);
  return null;
}
