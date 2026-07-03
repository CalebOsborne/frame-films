"use client";

import { motion } from "framer-motion";
import { Star, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GetTickets } from "@/components/movie/GetTickets";
import { CastList } from "@/components/movie/CastList";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { MovieReviews } from "@/components/movie/MovieReviews";
import { MovieTrailer } from "@/components/movie/MovieTrailer";
import { PeopleTalkingSection } from "@/components/movie/PeopleTalkingSection";
import { StreamingProviders } from "@/components/movie/StreamingProviders";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WatchlistButton } from "@/components/movie/WatchlistButton";
import { useMounted } from "@/hooks/useMounted";
import { getSeriesSlugByCollectionId } from "@/data/featuredSeries";
import { isInWatchlist, toggleWatchlist } from "@/lib/localStorage";
import { formatRating, formatRuntime, formatYear, getImageUrl } from "@/lib/tmdb";
import type { MovieDetails, MovieExtras } from "@/types/movie";

type MovieDetailsProps = {
  movie: MovieDetails;
  extras: MovieExtras;
  isInTheaters: boolean;
};

export function MovieDetailsView({ movie, extras, isInTheaters }: MovieDetailsProps) {
  const mounted = useMounted();
  const [saved, setSaved] = useState(false);
  const director = movie.credits?.crew.find((member) => member.job === "Director");

  useEffect(() => {
    setSaved(isInWatchlist(movie.id));
  }, [movie.id]);

  function handleWatchlist() {
    const { added } = toggleWatchlist(movie.id);
    setSaved(added);
  }

  return (
    <>
      <section className="relative min-h-[50vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={getImageUrl(movie.backdrop_path, "backdrop", "xl")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-zinc-950/70" />
          <div className="absolute inset-0 cinematic-gradient" />
        </div>

        <Container className="relative hero-top pb-16 sm:pb-20">
          <motion.div
            initial={mounted ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-12"
          >
            <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:w-52 md:w-56 lg:w-60">
              <Image
                src={getImageUrl(movie.poster_path, "poster", "lg")}
                alt={`${movie.title} poster`}
                fill
                sizes="(max-width: 768px) 192px, 240px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-8 md:gap-10 text-center md:text-left">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white break-words sm:text-4xl lg:text-5xl">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="mt-2 text-sm italic text-zinc-400 sm:text-base">{movie.tagline}</p>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  <Badge variant="rating" className="gap-1">
                    <Star className="h-3 w-3 fill-violet-400 text-violet-300" />
                    {formatRating(movie.vote_average)}
                  </Badge>
                  <Badge>{formatYear(movie.release_date)}</Badge>
                  <Badge>{formatRuntime(movie.runtime)}</Badge>
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                  {movie.genres?.map((genre) => (
                    <Badge key={genre.id}>{genre.name}</Badge>
                  ))}
                </div>

                {director && (
                  <p className="mt-4 text-sm text-zinc-400">
                    Directed by{" "}
                    <span className="font-medium text-zinc-200">{director.name}</span>
                  </p>
                )}

                {movie.belongs_to_collection && (() => {
                  const seriesSlug = getSeriesSlugByCollectionId(movie.belongs_to_collection.id);
                  if (!seriesSlug) return null;
                  return (
                    <p className="mt-2 text-sm">
                      <Link
                        href={`/series/${seriesSlug}`}
                        className="text-violet-400 transition-colors hover:text-violet-300"
                      >
                        Part of {movie.belongs_to_collection.name}
                      </Link>
                    </p>
                  );
                })()}
              </div>

              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                {isInTheaters && (
                  <Button asChild>
                    <a href="#get-tickets">
                      <Ticket className="h-4 w-4" aria-hidden="true" />
                      Get Tickets
                    </a>
                  </Button>
                )}
                <WatchlistButton saved={saved} onClick={handleWatchlist} size="lg" />
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <Container className="section-y stack-sections">
        {isInTheaters && (
          <GetTickets title={movie.title} releaseDate={movie.release_date} />
        )}

        <div className="grid grid-gap lg:grid-cols-2">
          <StreamingProviders providers={extras.providers} />
          <MovieTrailer
            trailer={extras.trailer}
            movieTitle={movie.title}
            backdropPath={movie.backdrop_path}
          />
        </div>

        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            {movie.overview || "No overview available for this title."}
          </p>
        </div>

        <PeopleTalkingSection
          movie={movie}
          extras={{
            buzz: extras.buzz,
            reviews: extras.reviews,
            providers: extras.providers,
          }}
        />

        <MovieReviews reviews={extras.reviews} />

        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <CastList cast={movie.credits.cast.slice(0, 12)} />
        )}
      </Container>

      {movie.similar && movie.similar.length > 0 && (
        <Container className="section-y">
          <MovieCarousel title="Similar Movies" movies={movie.similar} />
        </Container>
      )}
    </>
  );
}
