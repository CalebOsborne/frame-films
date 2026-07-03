"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { getWatchlist } from "@/lib/localStorage";
import type { Movie } from "@/types/movie";

export function WatchlistClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWatchlist() {
      const items = getWatchlist();
      if (items.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        const ids = items.map((item) => item.id).join(",");
        const response = await fetch(`/api/movies?ids=${ids}`);
        if (response.ok) {
          const data = (await response.json()) as { movies: Movie[] };
          setMovies(data.movies);
        }
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    loadWatchlist();

    function handleStorage() {
      loadWatchlist();
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Container className="page-top page-y">
      <div className="section-head">
        <p className="eyebrow mb-2.5">Your Collection</p>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-[2.125rem]">Watchlist</h1>
        <p className="mt-3.5 max-w-md text-[0.9375rem] leading-relaxed text-[#9494a0]">
          Movies saved locally on this device. Sign-in and cloud sync coming soon.
        </p>
      </div>

      {loading ? (
        <SkeletonGrid count={10} />
      ) : movies.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <Bookmark className="mb-4.5 h-10 w-10 text-zinc-600" aria-hidden="true" />
          <p className="text-lg font-medium text-zinc-300">Your watchlist is empty</p>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Browse movies and tap &ldquo;Add to Watchlist&rdquo; to save titles here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Discover Movies</Link>
          </Button>
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </Container>
  );
}
