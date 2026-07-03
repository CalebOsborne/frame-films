"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useMounted } from "@/hooks/useMounted";
import { formatRating, formatYear, getImageUrl } from "@/lib/tmdb";
import type { CollectionMovie } from "@/types/series";

type SeriesMovieListProps = {
  movies: CollectionMovie[];
  orderLabel: string;
};

export function SeriesMovieList({ movies, orderLabel }: SeriesMovieListProps) {
  const mounted = useMounted();

  if (movies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
        <p className="text-zinc-400">No movies available in this collection.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-5" aria-label={`Movies in ${orderLabel}`}>
      {movies.map((movie, index) => (
        <motion.li
          key={movie.id}
          initial={mounted ? { opacity: 0, x: -12 } : false}
          animate={mounted ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.3, delay: index * 0.04 }}
        >
          <Link
            href={`/movie/${movie.id}`}
            className="group grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-x-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-white/15 hover:bg-white/[0.04] sm:grid-cols-[3.5rem_7rem_minmax(0,1fr)] sm:gap-x-6 sm:p-6"
          >
            <span className="hidden h-10 min-w-10 items-center justify-center justify-self-center self-center rounded-full bg-violet-600/10 px-2 text-sm font-semibold tabular-nums text-violet-300 ring-1 ring-violet-500/20 sm:flex">
              {index + 1}
            </span>

            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-800">
              <Image
                src={getImageUrl(movie.poster_path, "poster", "md")}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white transition-colors group-hover:text-violet-300 sm:text-lg">
                {movie.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge>{formatYear(movie.release_date)}</Badge>
                <Badge variant="rating" className="gap-1">
                  <Star className="h-3 w-3 fill-violet-400 text-violet-300" />
                  {formatRating(movie.vote_average)}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-3">{movie.overview}</p>
            </div>
          </Link>
        </motion.li>
      ))}
    </ol>
  );
}
