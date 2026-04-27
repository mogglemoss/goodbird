import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset window scroll on navigation by default —
 * navigating to a new route inherits the previous page's scrollY. This
 * mounts once inside BrowserRouter and snaps to the top on every
 * pathname change.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
