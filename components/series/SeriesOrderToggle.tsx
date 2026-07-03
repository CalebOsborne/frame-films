"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SeriesSortMode } from "@/types/series";

type SeriesOrderToggleProps = {
  mode: SeriesSortMode;
  onChange: (mode: SeriesSortMode) => void;
  hasChronological: boolean;
};

type PillRect = {
  left: number;
  width: number;
  opacity: number;
};

const hiddenPill: PillRect = { left: 0, width: 0, opacity: 0 };

const options: SeriesSortMode[] = ["release", "chronological"];

const pillSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export function SeriesOrderToggle({ mode, onChange, hasChronological }: SeriesOrderToggleProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<SeriesSortMode, HTMLButtonElement>());
  const [pill, setPill] = useState<PillRect>(hiddenPill);

  const updatePill = useCallback(() => {
    const container = containerRef.current;
    const activeButton = buttonRefs.current.get(mode);

    if (!container || !activeButton) {
      setPill(hiddenPill);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setPill({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
      opacity: 1,
    });
  }, [mode]);

  const schedulePillUpdate = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePill);
    });
  }, [updatePill]);

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
  }, [schedulePillUpdate, mode]);

  const pillTransition = prefersReducedMotion ? { duration: 0 } : pillSpring;

  return (
    <div
      ref={containerRef}
      className="relative inline-flex w-fit max-w-full shrink-0 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {pill.opacity > 0 && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1 bottom-1 rounded-full bg-violet-700 shadow-lg shadow-violet-900/30"
          initial={false}
          animate={{
            left: pill.left,
            width: pill.width,
            opacity: pill.opacity,
          }}
          transition={pillTransition}
        />
      )}

      {options.map((option) => {
        const isActive = mode === option;
        const isDisabled = option === "chronological" && !hasChronological;

        return (
          <button
            key={option}
            ref={(node) => {
              if (node) {
                buttonRefs.current.set(option, node);
              } else {
                buttonRefs.current.delete(option);
              }
            }}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(option)}
            className={cn(
              "relative z-10 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:px-4 sm:py-2 sm:text-sm",
              isDisabled && "cursor-not-allowed opacity-40",
              !isDisabled && !isActive && "text-zinc-400 hover:text-white",
              isActive && "text-white",
            )}
            aria-pressed={isActive}
          >
            <span className="sm:hidden">
              {option === "release" ? "Release" : "Timeline"}
            </span>
            <span className="hidden sm:inline">
              {option === "release" ? "Release Order" : "Chronological Order"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
