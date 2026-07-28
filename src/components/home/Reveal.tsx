"use client";

import { useEffect } from "react";

/**
 * A single IntersectionObserver for every `[data-reveal]` element on the page.
 *
 * Mounted once, it lets the entire homepage stay a Server Component — there is
 * no client wrapper around each animated element and no per-element listener.
 * Elements are unobserved the moment they land, so the observer empties itself
 * as the reader descends.
 */
export default function Reveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-inview"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
