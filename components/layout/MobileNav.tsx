"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, Clapperboard, Film, Home, Layers, Menu, Search, Star, TrendingUp, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { FrameLogo } from "@/components/layout/FrameLogo";
import { mobileNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { sanitizeSearchQuery } from "@/lib/tmdb";

const navIcons = {
  "/": Home,
  "/search": Search,
  "/search?sort=popularity": TrendingUp,
  "/search?sort=release_date": Film,
  "/search?sort=rating": Star,
  "/#movie-series": Layers,
  "/watchlist": Bookmark,
} as const;

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const sanitized = sanitizeSearchQuery(query);
    if (sanitized.length < 1) return;
    router.push(`/search?q=${encodeURIComponent(sanitized)}`);
    onClose();
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
        onClick={onClose}
      />

      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={cn(
          "safe-top safe-bottom fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-violet-500/10 bg-[#050508]/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between">
          <FrameLogo showTagline />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mt-6">
          <label htmlFor="mobile-search" className="sr-only">
            Search movies
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              id="mobile-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search films..."
              className="h-11 w-full rounded-full border border-white/10 bg-white/5 pr-4 pl-10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </form>

        <ul className="mt-8 flex flex-col gap-3">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href || (item.href.startsWith("/search") && pathname === "/search");
            const Icon = navIcons[item.href as keyof typeof navIcons] ?? Clapperboard;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "border-[#7365f0]/20 bg-[#7365f0]/10 text-[#c4bdf8]"
                      : "border-transparent text-[#6b6b76] hover:border-white/[0.05] hover:bg-white/[0.03] hover:text-zinc-200",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export function MobileNavToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:bg-white/5 hover:text-white md:hidden"
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
