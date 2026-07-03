import { Suspense } from "react";
import { MovieCarousel } from "@/components/movie/MovieCarousel";
import { MovieHero } from "@/components/movie/MovieHero";
import { MovieTrailer } from "@/components/movie/MovieTrailer";
import { PeopleTalkingSection } from "@/components/movie/PeopleTalkingSection";
import { SeriesGrid } from "@/components/series/SeriesGrid";
import { Container } from "@/components/ui/Container";
import { SkeletonCard, SkeletonGrid } from "@/components/ui/SkeletonCard";
import { featuredSeries } from "@/data/featuredSeries";
import {
  getCollection,
  getCollectionBackdropPath,
  getMovieExtras,
  getMovieGenres,
  getMovieOfTheWeek,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
  TMDbError,
} from "@/lib/tmdb";

/** Revalidate homepage every 6 hours so Movie of the Week stays current */
export const revalidate = 21600;

async function HomeContent() {
  try {
    const [
      movieOfTheWeek,
      trending,
      newReleases,
      popular,
      topRated,
      upcoming,
      genres,
      ...collectionResults
    ] = await Promise.all([
      getMovieOfTheWeek(),
      getTrendingMovies("week"),
      getNowPlayingMovies(),
      getPopularMovies(),
      getTopRatedMovies(),
      getUpcomingMovies(),
      getMovieGenres(),
      ...featuredSeries.map((series) =>
        getCollection(series.collectionId).catch(() => null),
      ),
    ]);

    const featuredMovie = movieOfTheWeek?.movie ?? null;
    const featuredExtras = featuredMovie ? await getMovieExtras(featuredMovie) : null;

    const trendingForCarousel = featuredMovie
      ? trending.filter((m) => m.id !== featuredMovie.id)
      : trending;
    const backdrops = Object.fromEntries(
      featuredSeries.map((series, index) => [
        series.slug,
        getCollectionBackdropPath(collectionResults[index]),
      ]),
    );

    return (
      <>
        {featuredMovie && movieOfTheWeek && (
          <MovieHero
            movie={featuredMovie}
            weekLabel={movieOfTheWeek.weekLabel}
            trendingRank={movieOfTheWeek.trendingRank}
            isInTheaters={movieOfTheWeek.isInTheaters}
          />
        )}

        {featuredMovie && featuredExtras && (
          <>
            <Container className="section-y-after-hero">
              <MovieTrailer
                trailer={featuredExtras.trailer}
                movieTitle={featuredMovie.title}
                backdropPath={featuredMovie.backdrop_path}
              />
            </Container>
            <PeopleTalkingSection
              movie={featuredMovie}
              extras={featuredExtras}
              variant="featured"
            />
          </>
        )}

        <Container className="section-y">
          <div className="stack-sections">
            <MovieCarousel
            id="new-releases"
            eyebrow="In Theaters"
            title="New Releases"
            description="Currently playing and recently released films."
            movies={newReleases.results.slice(0, 15)}
            genres={genres}
          />

          <MovieCarousel
            title="Trending This Week"
            movies={trendingForCarousel.slice(0, 15)}
            genres={genres}
          />

          <MovieCarousel
            title="Popular Movies"
            movies={popular.results.slice(0, 15)}
            genres={genres}
          />

          <MovieCarousel
            title="Top Rated Movies"
            movies={topRated.results.slice(0, 15)}
            genres={genres}
          />

          <MovieCarousel
            title="Upcoming Movies"
            movies={upcoming.results.slice(0, 15)}
            genres={genres}
          />
          </div>
        </Container>

        <SeriesGrid series={featuredSeries} backdrops={backdrops} />
      </>
    );
  } catch (error) {
    if (error instanceof TMDbError) {
      return <HomeError />;
    }
    throw error;
  }
}

function HomeFallback() {
  return (
    <>
      <SkeletonCard variant="backdrop" className="aspect-auto h-dvh rounded-none" />
      <Container className="space-y-10 py-10 sm:space-y-12 sm:py-12">
        <SkeletonCard variant="row" />
        <SkeletonCard variant="row" />
        <SkeletonGrid count={10} />
      </Container>
    </>
  );
}

function HomeError() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-2xl font-semibold text-white">Unable to load movies</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-400">
        Check that your TMDb API credentials are set in{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 text-zinc-300">.env.local</code> and try
        again.
      </p>
    </Container>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
