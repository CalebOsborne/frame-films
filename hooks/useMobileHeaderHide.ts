"use client";

import { useEffect, useRef, useState } from "react";

const MOBILE_MAX_WIDTH = 767;
const SCROLL_DELTA = 8;
const TOP_THRESHOLD = 12;

export function useMobileHeaderHide(disabled = false) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function update() {
      const scrollY = window.scrollY;
      const isMobile = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;

      if (!isMobile || disabled) {
        setHidden(false);
      } else if (scrollY <= TOP_THRESHOLD) {
        setHidden(false);
      } else if (scrollY > lastScrollY.current + SCROLL_DELTA) {
        setHidden(true);
      } else if (scrollY < lastScrollY.current - SCROLL_DELTA) {
        setHidden(false);
      }

      lastScrollY.current = scrollY;
      ticking.current = false;
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [disabled]);

  return hidden;
}
