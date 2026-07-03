"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bookmark, Search } from "lucide-react";
import { FormEvent, useCallback, useState } from "react";
import { FrameLogo } from "@/components/layout/FrameLogo";
import { HeaderQuickLinks } from "@/components/layout/HeaderQuickLinks";
import { MobileNav, MobileNavToggle } from "@/components/layout/MobileNav";
import { useMobileHeaderHide } from "@/hooks/useMobileHeaderHide";
import { sanitizeSearchQuery } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");

  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(() => setIsMobileNavOpen((prev) => !prev), []);
  const currentSort = searchParams.get("sort");

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const sanitized = sanitizeSearchQuery(query);
    if (sanitized.length < 1) return;
    router.push(`/search?q=${encodeURIComponent(sanitized)}`);
  }

  const isWatchlistActive = pathname === "/watchlist";
  const isHeaderHidden = useMobileHeaderHide(isMobileNavOpen);

  return (
    <>
      <header
        className={cn(
          "header-auto-hide safe-top pointer-events-none fixed inset-x-0 top-0 z-30 px-5 pt-[var(--header-offset)] sm:px-6 lg:px-8",
          isHeaderHidden && "header-auto-hide--hidden",
        )}
      >
        <nav
          aria-label="Main navigation"
          className="pointer-events-auto nav-glass mx-auto flex h-14 w-full max-w-7xl items-center gap-3 rounded-[1.125rem] border border-white/[0.07] px-3 sm:gap-4 sm:px-4 lg:h-[3.75rem] lg:gap-6"
        >
          <FrameLogo />

          <div className="relative z-[1] hidden min-w-0 flex-1 items-center gap-4 md:flex lg:gap-6">
            <HeaderQuickLinks pathname={pathname} currentSort={currentSort} />

            <form onSubmit={handleSearch} className="min-w-0 flex-1 md:max-w-xs lg:max-w-sm">
              <label htmlFor="header-search" className="sr-only">
                Search movies
              </label>
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <input
                  id="header-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search films..."
                  className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pr-4 pl-10 text-sm text-white placeholder:text-[#6b6b76] transition-[border-color,background-color] duration-200 focus:border-[#7365f0]/30 focus:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-[#7365f0]/15"
                />
              </div>
            </form>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0">
            <Link
              href="/watchlist"
              className={cn(
                "hidden h-9 w-9 items-center justify-center rounded-xl border transition-[color,background-color,border-color] duration-200 md:inline-flex",
                isWatchlistActive
                  ? "border-[#7365f0]/25 bg-[#7365f0]/10 text-[#c4bdf8]"
                  : "border-white/[0.08] text-[#6b6b76] hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-zinc-200",
              )}
              aria-current={isWatchlistActive ? "page" : undefined}
              aria-label="Watchlist"
            >
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            </Link>
            <MobileNavToggle isOpen={isMobileNavOpen} onToggle={toggleMobileNav} />
          </div>
        </nav>
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </>
  );
}
