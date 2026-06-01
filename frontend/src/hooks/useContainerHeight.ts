import { type RefObject, useEffect, useState } from "react";

/**
 * Tracks the live pixel height of a container via ResizeObserver.
 * Used to feed antd Table's `scroll.y` a real number instead of a
 * hardcoded `calc(100vh - XXXpx)` that only fits one screen size.
 *
 * The effect intentionally has no dependency array so it re-runs after
 * every render: this way it still attaches the observer when the ref'd
 * element mounts late (e.g. a component that renders a loading spinner
 * before the table container — a hard page reload would otherwise leave
 * the observer unattached and the height stuck at its default).
 */
export function useContainerHeight(containerRef: RefObject<HTMLElement | null>) {
  const [height, setHeight] = useState(400);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) setHeight((prev) => (Math.abs(prev - h) > 0.5 ? h : prev));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  });

  return height;
}
