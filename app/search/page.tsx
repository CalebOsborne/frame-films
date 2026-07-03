import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchFilters } from "@/components/movie/SearchFilters";
import { SearchResults } from "@/components/movie/SearchResults";
import { Container } from "@/components/ui/Container";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export const metadata: Metadata = {
  title: "Search Movies",
  description: "Search and filter movies by title, genre, year, rating, and more.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    year?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <Container className="page-top page-y">
      <div className="section-head">
        <p className="mb-2 text-xs font-medium tracking-[0.2em] text-violet-400/80 uppercase">
          Discover
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Search Movies</h1>
        <p className="mt-3 max-w-xl text-sm text-zinc-400">
          Search by title, franchise, or actor. Filter by genre, year, rating, and popularity.
        </p>
      </div>

      <Suspense fallback={<div className="skeleton-shimmer mb-8 h-40 rounded-2xl" />}>
        <SearchFilters />
      </Suspense>

      <div className="mt-10">
        <Suspense fallback={<SkeletonGrid count={10} />}>
          <SearchResults searchParams={params} />
        </Suspense>
      </div>
    </Container>
  );
}
