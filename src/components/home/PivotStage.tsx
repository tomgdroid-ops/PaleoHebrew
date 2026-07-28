"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Turns scroll position through this section into a single custom property,
 * `--p` (0 → 1). Every transformation in Act III is derived from it in CSS.
 *
 * The scroll listener only exists while the section is on screen, work is
 * coalesced into one rAF per frame, and each frame writes exactly one property
 * on one element. Under reduced motion no listener is attached at all and the
 * scene resolves to its finished state.
 */
export default function PivotStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 1 : -rect.top / travel;
      el.style.setProperty("--p", Math.min(1, Math.max(0, progress)).toFixed(4));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const listen = () => {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    };

    const unlisten = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    const gate = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          listen();
          update();
        } else {
          unlisten();
        }
      },
      { threshold: 0 },
    );

    gate.observe(el);
    update();

    return () => {
      gate.disconnect();
      unlisten();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
