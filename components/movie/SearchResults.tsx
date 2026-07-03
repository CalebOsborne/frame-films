import type { Movie, SearchResult } from "@/types/movie";
import Link from "next/link";
import { MovieGrid } from "@/components/movie/MovieGrid";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  discoverMovies,
  getMovieGenres,
  sanitizeSearchQuery,
  searchMulti,
  searchMovies,
} from "@/lib/tmdb";

type SearchResultsProps = {
  searchParams: {
    q?: string;
    genre?: string;
    year?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
};

function PersonResults({ results, moviesOnly }: { results: SearchResult[]; moviesOnly?: boolean }) {
  const people = results.filter((item) => item.media_type === "person");

  if (people.length === 0) return null;

  return (
    <div className={cn("mb-10", moviesOnly && "hidden md:block")}>
      <h2 className="section-head text-lg font-semibold text-white">People</h2>
      <ul className="grid grid-gap sm:grid-cols-2 lg:grid-cols-3">
        {people.slice(0, 6).map((person) => (
          <li key={person.id}>
            <Link
              href={`/search?q=${encodeURIComponent(person.name ?? "")}`}
              className="block rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-sm text-zinc-300 transition-colors hover:border-white/15 hover:text-white"
            >
              <span className="font-medium text-white">{person.name}</span>
              {person.known_for_department && (
                <span className="mt-1 block text-xs text-zinc-500">
                  {person.known_for_department}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SearchResults({ searchParams: params }: SearchResultsProps) {
  const query = sanitizeSearchQuery(params.q ?? "");
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const hasFilters = Boolean(params.genre || params.year || params.rating || params.sort);

  let movies: Movie[] = [];
  let totalPages = 1;
  let people: SearchResult[] = [];
  const genres = await getMovieGenres();

  if (query.length > 0) {
    const [movieResults, multiResults] = await Promise.all([
      searchMovies(query, page),
      searchMulti(query, 1),
    ]);
    movies = movieResults.results;
    totalPages = movieResults.total_pages;
    people = multiResults.results;
  } else if (hasFilters || params.sort) {
    const results = await discoverMovies({
      genre: params.genre,
      year: params.year,
      rating: params.rating,
      sortBy: params.sort ?? "popularity",
      page,
    });
    movies = results.results;
    totalPages = results.total_pages;
  }

  const hasQuery = query.length > 0 || hasFilters;

  if (!hasQuery) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
        <p className="text-lg font-medium text-zinc-300">Start your search</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Enter a movie title, franchise name, or actor to discover films.
        </p>
      </div>
    );
  }

  const nextPageParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) nextPageParams.set(key, value);
  });
  nextPageParams.set("page", String(page + 1));

  return (
    <>
      {people.length > 0 && <PersonResults results={people} moviesOnly={query.length > 0} />}

      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {movies.length > 0 ? `Showing ${movies.length} results` : "No results found"}
          {query && (
            <>
              {" "}
              for <span className="text-zinc-300">&ldquo;{query}&rdquo;</span>
            </>
          )}
        </p>
      </div>

      <MovieGrid movies={movies} genres={genres} returnQuery={query || undefined} />

      {totalPages > page && (
        <div className="mt-10 flex justify-center">
          <Button asChild variant="secondary">
            <Link href={`/search?${nextPageParams.toString()}`}>Load More</Link>
          </Button>
        </div>
      )}
    </>
  );
}
