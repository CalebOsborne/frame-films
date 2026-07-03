"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { sanitizeSearchQuery } from "@/lib/tmdb";

type MobileSearchBarProps = {
  defaultQuery: string;
};

export function MobileSearchBar({ defaultQuery }: MobileSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const sanitized = sanitizeSearchQuery(query);
    if (sanitized.length < 1) return;
    router.push(`/search?q=${encodeURIComponent(sanitized)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5 md:hidden">
      <label htmlFor="mobile-results-search" className="sr-only">
        Search movies
      </label>
      <div className="relative">
        <Search
          className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <input
          id="mobile-results-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search films..."
          className="h-11 w-full rounded-full border border-white/10 bg-white/5 pr-4 pl-10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </div>
    </form>
  );
}
