"use client";

import { motion } from "framer-motion";
import { Play, Star, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { WatchlistButton } from "@/components/movie/WatchlistButton";
import { useMounted } from "@/hooks/useMounted";
import { isInWatchlist, toggleWatchlist } from "@/lib/localStorage";
import { getPrimaryTicketUrl } from "@/lib/tickets";
import { formatRating, formatYear, getImageUrl } from "@/lib/tmdb";
import type { Movie } from "@/types/movie";

type MovieHeroProps = {
  movie: Movie;
  weekLabel?: string;
  trendingRank?: number;
  isInTheaters?: boolean;
};

export function MovieHero({ movie, weekLabel, trendingRank, isInTheaters }: MovieHeroProps) {
  const mounted = useMounted();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(movie.id));
  }, [movie.id]);

  function handleWatchlist() {
    const { added } = toggleWatchlist(movie.id);
    setSaved(added);
  }

  return (
    <section
      aria-label="Movie of the Week"
      className="relative flex overflow-x-hidden pt-[var(--header-clearance)] pb-5 md:min-h-dvh md:items-center md:justify-center md:pb-14 md:h-dvh md:overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={getImageUrl(movie.backdrop_path, "backdrop", "xl")}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-zinc-950/60" />
        <div className="absolute inset-0 cinematic-gradient" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-6xl xl:max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-8 md:justify-start">
            <Badge variant="accent">Movie of the Week</Badge>
            {weekLabel && <Badge className="text-zinc-300">{weekLabel}</Badge>}
            {isInTheaters && (
              <Badge className="border-[#7365f0]/25 bg-[#7365f0]/10 text-[#c4bdf8]">
                In Theaters
              </Badge>
            )}
          </div>

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-14 xl:gap-20">
            <motion.div
              initial={mounted ? { opacity: 0, y: 24 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hero-poster relative aspect-[2/3] shrink-0 overflow-hidden rounded-[1.125rem] shadow-[0_24px_48px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.08]"
            >
              <Image
                src={getImageUrl(movie.poster_path, "poster", "lg")}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                className="object-cover"
                priority
              />
            </motion.div>

            <motion.div
              initial={mounted ? { opacity: 0, y: 32 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="flex w-full min-w-0 flex-1 flex-col gap-8 text-center md:gap-10 md:text-left"
            >
              <div>
                <h1 className="text-4xl font-semibold tracking-[-0.03em] text-white break-words sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                  {movie.title}
                </h1>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-zinc-400 md:justify-start">
                <span className="inline-flex items-center gap-1.5 tabular-nums text-zinc-300">
                  <Star className="h-3.5 w-3.5 fill-[#9d94f5] text-[#9d94f5]" aria-hidden="true" />
                  {formatRating(movie.vote_average)}
                </span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{formatYear(movie.release_date)}</span>
                {trendingRank && trendingRank <= 10 && (
                  <>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>#{trendingRank} Trending</span>
                  </>
                )}
              </div>

              <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.7] text-zinc-400 sm:text-base">
                {movie.overview || "No overview available."}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Button asChild size="lg">
                <Link href={`/movie/${movie.id}`}>
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  View Details
                </Link>
              </Button>
              {isInTheaters && (
                <Button asChild size="lg" variant="secondary">
                  <a
                    href={getPrimaryTicketUrl(movie.title, movie.release_date)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Ticket className="h-4 w-4" aria-hidden="true" />
                    Get Tickets
                  </a>
                </Button>
              )}
              <WatchlistButton saved={saved} onClick={handleWatchlist} size="lg" />
            </div>
          </motion.div>
        </div>
        </div>
      </Container>
    </section>
  );
}
