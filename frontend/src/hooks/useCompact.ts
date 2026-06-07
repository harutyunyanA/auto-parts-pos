import { useSyncExternalStore } from "react";

/**
 * Reactive flag for the compact UI mode, driven by viewport height.
 *
 * Low screens (e.g. 1366×768 laptops) leave little vertical room, so we switch
 * the whole app into AntD's compact theme + tighter layout chrome. Keyed on
 * `max-height` rather than width because the constraint is vertical, and on the
 * live viewport (not the physical screen) so the browser chrome / taskbar count.
 *
 * Toggles live on window resize. SSR fallback is `false` (normal density).
 */
const QUERY = "(max-height: 800px)";

const subscribe = (cb: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

export function useCompact() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
