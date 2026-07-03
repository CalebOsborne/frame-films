import { MovieCard } from "@/components/movie/MovieCard";
import type { Movie } from "@/types/movie";

type MovieGridProps = {
  movies: Movie[];
  genres?: { id: number; name: string }[];
};

export function MovieGrid({ movies, genres }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
        <p className="text-lg font-medium text-zinc-300">No movies found</p>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Try adjusting your filters or search for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 grid-gap sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} index={index} />
      ))}
    </div>
  );
}
