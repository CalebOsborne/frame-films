"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useMounted } from "@/hooks/useMounted";
import { formatRating, formatYear, getImageUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
  genres?: { id: number; name: string }[];
  priority?: boolean;
  index?: number;
  returnQuery?: string;
};

export function MovieCard({ movie, genres, priority = false, index = 0, returnQuery }: MovieCardProps) {
  const mounted = useMounted();
  const movieGenres = genres?.filter((g) => movie.genre_ids?.includes(g.id)).slice(0, 2) ?? movie.genres?.slice(0, 2) ?? [];
  const movieHref = returnQuery
    ? `/movie/${movie.id}?q=${encodeURIComponent(returnQuery)}`
    : `/movie/${movie.id}`;

  return (
    <motion.article
      initial={mounted ? { opacity: 0, y: 16 } : false}
      whileInView={mounted ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={movieHref} className="block rounded-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7365f0]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060a]">
        <div className="relative aspect-[2/3] overflow-hidden rounded-[13px] bg-[#0e0d14] ring-1 ring-white/[0.06] transition-[box-shadow,ring-color] duration-300 ease-out group-hover:ring-white/[0.12] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <Image
            src={getImageUrl(movie.poster_path, "poster", "md")}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute top-2.5 right-2.5">
            <Badge variant="ratingOverlay" className="gap-1 tabular-nums">
              <Star className="h-3 w-3 fill-[#9d94f5] text-[#9d94f5]" aria-hidden="true" />
              {formatRating(movie.vote_average)}
            </Badge>
          </div>
        </div>

        <div className="mt-3.5 space-y-1">
          <h3 className="line-clamp-1 text-[0.875rem] font-medium tracking-[-0.01em] text-zinc-100 transition-colors duration-200 group-hover:text-white">
            {movie.title}
          </h3>
          <p className="text-xs text-[#6b6b76]">
            {formatYear(movie.release_date)}
            {movieGenres.length > 0 && (
              <span className="text-[#6b6b76]">
                {" · "}
                {movieGenres.map((g) => g.name).join(", ")}
              </span>
            )}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
