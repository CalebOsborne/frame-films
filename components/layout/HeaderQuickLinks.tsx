"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { headerQuickLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";

const linkClassName =
  "relative z-10 rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap xl:px-3.5";

const liquidSpring = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 1,
};

const liquidTrailSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 30,
  mass: 1.1,
};

type PillRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
};

const hiddenPill: PillRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  opacity: 0,
};

type HeaderQuickLinksProps = {
  pathname: string;
  currentSort: string | null;
};

function getCurrentHash() {
  return typeof window === "undefined" ? "" : window.location.hash;
}

function isQuickLinkActive(
  href: string,
  pathname: string,
  sort: string | null,
  hash: string,
) {
  if (href === "/") {
    return pathname === "/" && hash !== "#movie-series";
  }

  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }

  if (!href.startsWith("/search")) {
    return pathname === href;
  }

  const linkSort = new URL(href, "http://localhost").searchParams.get("sort");
  return pathname === "/search" && (linkSort ? linkSort === sort : !sort);
}

export function HeaderQuickLinks({ pathname, currentSort }: HeaderQuickLinksProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [pill, setPill] = useState<PillRect>(hiddenPill);
  const [hash, setHash] = useState("");

  const syncHash = useCallback(() => {
    const nextHash = getCurrentHash();
    setHash((prev) => (prev === nextHash ? prev : nextHash));
  }, []);

  const syncHashDeferred = useCallback(() => {
    queueMicrotask(syncHash);
  }, [syncHash]);

  useEffect(() => {
    syncHash();

    window.addEventListener("hashchange", syncHashDeferred);
    window.addEventListener("popstate", syncHashDeferred);

    return () => {
      window.removeEventListener("hashchange", syncHashDeferred);
      window.removeEventListener("popstate", syncHashDeferred);
    };
  }, [pathname, syncHash, syncHashDeferred]);

  const updatePill = useCallback(() => {
    const currentHash = getCurrentHash();
    const activeItem = headerQuickLinks.find((item) =>
      isQuickLinkActive(item.href, pathname, currentSort, currentHash),
    );

    if (!activeItem || !containerRef.current) {
      setPill(hiddenPill);
      return;
    }

    const linkEl = linkRefs.current.get(activeItem.href);
    if (!linkEl) {
      setPill(hiddenPill);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    setPill({
      left: linkRect.left - containerRect.left,
      top: linkRect.top - containerRect.top,
      width: linkRect.width,
      height: linkRect.height,
      opacity: 1,
    });
  }, [pathname, currentSort]);

  const schedulePillUpdate = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePill);
    });
  }, [updatePill]);

  const handleNavClick = useCallback(() => {
    syncHashDeferred();
    window.setTimeout(syncHashDeferred, 0);
    window.setTimeout(syncHashDeferred, 50);
    schedulePillUpdate();
    window.setTimeout(schedulePillUpdate, 0);
    window.setTimeout(schedulePillUpdate, 50);
  }, [syncHashDeferred, schedulePillUpdate]);

  const handleLinkClick = useCallback(
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

      if (href === "/") {
        if (pathname === "/" && window.location.hash) {
          event.preventDefault();
          window.history.replaceState(null, "", "/");
          setHash("");
          schedulePillUpdate();
          window.scrollTo({ top: 0, behavior: scrollBehavior });
        }
      } else if (href.startsWith("/#")) {
        const targetHash = href.slice(1);

        if (pathname === "/") {
          event.preventDefault();

          if (window.location.hash !== targetHash) {
            window.history.pushState(null, "", href);
            setHash(targetHash);
          }

          schedulePillUpdate();
          document.querySelector(targetHash)?.scrollIntoView({
            behavior: scrollBehavior,
            block: "start",
          });
        }
      }

      handleNavClick();
    },
    [pathname, prefersReducedMotion, schedulePillUpdate, handleNavClick],
  );

  useEffect(() => {
    schedulePillUpdate();

    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(schedulePillUpdate);
    resizeObserver.observe(container);

    window.addEventListener("resize", schedulePillUpdate);
    document.fonts?.ready.then(schedulePillUpdate).catch(() => undefined);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", schedulePillUpdate);
    };
  }, [schedulePillUpdate, pathname, currentSort, hash]);

  const pillTransition = prefersReducedMotion ? { duration: 0 } : liquidSpring;
  const trailTransition = prefersReducedMotion ? { duration: 0 } : liquidTrailSpring;

  return (
    <div
      ref={containerRef}
      className="relative isolate flex shrink-0 items-center gap-0.5 lg:gap-1"
    >
      {pill.opacity > 0 && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              backgroundColor: "rgba(115, 101, 240, 0.22)",
              boxShadow: "0 0 8px rgba(115, 101, 240, 0.15)",
            }}
            initial={false}
            animate={{
              left: pill.left - 2,
              top: pill.top - 2,
              width: pill.width + 4,
              height: pill.height + 4,
              opacity: pill.opacity,
            }}
            transition={trailTransition}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute rounded-full ring-1 ring-[#9d94f5]/25"
            style={{
              backgroundColor: "rgba(115, 101, 240, 0.92)",
              boxShadow: "0 0 12px rgba(115, 101, 240, 0.2)",
            }}
            initial={false}
            animate={{
              left: pill.left,
              top: pill.top,
              width: pill.width,
              height: pill.height,
              opacity: pill.opacity,
            }}
            transition={pillTransition}
          />
        </>
      )}

      {headerQuickLinks.map((item) => {
        const isActive = isQuickLinkActive(item.href, pathname, currentSort, hash);

        return (
          <Link
            key={item.href}
            ref={(node) => {
              if (node) {
                linkRefs.current.set(item.href, node);
              } else {
                linkRefs.current.delete(item.href);
              }
            }}
            href={item.href}
            onClick={handleLinkClick(item.href)}
            className={cn(
              linkClassName,
              "transition-colors",
              isActive ? "text-white" : "text-[#6b6b76] hover:bg-white/[0.04] hover:text-zinc-200",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="xl:hidden">{item.shortLabel ?? item.label}</span>
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
