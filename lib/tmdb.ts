import type {
  Credits,
  DiscoverFilters,
  Movie,
  MovieDetails,
  MovieExtras,
  MovieOfTheWeek,
  MovieReview,
  MovieVideo,
  SearchResult,
  TMDbListResponse,
  WatchProvider,
  WatchProviders,
} from "@/types/movie";
import type { CollectionDetails } from "@/types/series";
import { buildBuzzSummary } from "@/lib/sentiment";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const IMAGE_SIZES = {
  poster: { sm: "w185", md: "w342", lg: "w500" },
  backdrop: { sm: "w780", lg: "w1280", xl: "original" },
  profile: { sm: "w185", md: "w342" },
} as const;

const PLACEHOLDER_POSTER = "/images/poster-placeholder.svg";
const PLACEHOLDER_BACKDROP = "/images/backdrop-placeholder.svg";
const PLACEHOLDER_PROFILE = "/images/profile-placeholder.svg";

export class TMDbError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "TMDbError";
  }
}

function getAuthHeaders(): HeadersInit {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = 3600,
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!apiKey && !token) {
    throw new TMDbError(
      "TMDb credentials missing. Set TMDB_API_KEY or TMDB_ACCESS_TOKEN in .env.local",
      500,
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  const response = await fetch(url.toString(), {
    headers: {
      ...getAuthHeaders(),
      Accept: "application/json",
    },
    next: { revalidate },
  });

  if (!response.ok) {
    throw new TMDbError(`TMDb request failed: ${response.statusText}`, response.status);
  }

  return response.json() as Promise<T>;
}

export function getCollectionBackdropPath(
  collection: Pick<CollectionDetails, "backdrop_path" | "parts"> | null | undefined,
): string | null {
  if (!collection) return null;
  if (collection.backdrop_path) return collection.backdrop_path;
  return collection.parts.find((part) => part.backdrop_path)?.backdrop_path ?? null;
}

export function getImageUrl(
  path: string | null | undefined,
  type: "poster" | "backdrop" | "profile" = "poster",
  size: "sm" | "md" | "lg" | "xl" = "md",
): string {
  if (!path) {
    if (type === "backdrop") return PLACEHOLDER_BACKDROP;
    if (type === "profile") return PLACEHOLDER_PROFILE;
    return PLACEHOLDER_POSTER;
  }

  const sizeMap = {
    poster: { sm: IMAGE_SIZES.poster.sm, md: IMAGE_SIZES.poster.md, lg: IMAGE_SIZES.poster.lg, xl: IMAGE_SIZES.poster.lg },
    backdrop: { sm: IMAGE_SIZES.backdrop.sm, md: IMAGE_SIZES.backdrop.lg, lg: IMAGE_SIZES.backdrop.lg, xl: IMAGE_SIZES.backdrop.xl },
    profile: { sm: IMAGE_SIZES.profile.sm, md: IMAGE_SIZES.profile.md, lg: IMAGE_SIZES.profile.md, xl: IMAGE_SIZES.profile.md },
  };

  return `${TMDB_IMAGE_BASE}/${sizeMap[type][size]}${path}`;
}

export function formatRating(rating: number): string {
  return rating > 0 ? rating.toFixed(1) : "N/A";
}

export function formatYear(date: string | undefined): string {
  if (!date) return "TBA";
  return date.slice(0, 4);
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return "—";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week",
  revalidate = 3600,
): Promise<Movie[]> {
  const data = await tmdbFetch<TMDbListResponse<Movie>>(
    `/trending/movie/${timeWindow}`,
    {},
    revalidate,
  );
  return data.results;
}

/** Week range label using UTC so server and client always match. */
export function getCurrentWeekLabel(): string {
  const now = new Date();
  const utcDay = now.getUTCDay();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - utcDay),
  );
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - utcDay + 6),
  );

  const format = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  return `${format(start)} – ${format(end)}, ${now.getUTCFullYear()}`;
}

function scoreMovieOfTheWeekCandidate(
  movie: Movie,
  trendingIndex: number,
  isInTheaters: boolean,
): number {
  const currentYear = new Date().getFullYear();
  const releaseYear = parseInt(movie.release_date?.slice(0, 4) ?? "0", 10);

  let score = Math.max(0, 100 - trendingIndex * 4);

  if (movie.backdrop_path) score += 35;
  if (movie.poster_path) score += 10;
  if (movie.overview.length > 100) score += 10;
  if (isInTheaters) score += 40;
  if (releaseYear >= currentYear) score += 30;
  else if (releaseYear >= currentYear - 1) score += 20;
  if (movie.vote_count >= 50) score += 10;
  if (movie.vote_average >= 6) score += 5;

  return score;
}

/**
 * Picks the best featured film from TMDb's weekly trending list.
 * Prioritizes recent, in-theaters titles with quality hero assets.
 * Revalidates every 6 hours so the pick stays current throughout the week.
 */
export async function getMovieOfTheWeek(): Promise<MovieOfTheWeek | null> {
  const MOVIE_OF_WEEK_REVALIDATE = 21600; // 6 hours

  const [trending, nowPlayingIds] = await Promise.all([
    tmdbFetch<TMDbListResponse<Movie>>(
      "/trending/movie/week",
      {},
      MOVIE_OF_WEEK_REVALIDATE,
    ),
    getNowPlayingMovieIds(MOVIE_OF_WEEK_REVALIDATE),
  ]);

  if (trending.results.length === 0) return null;

  const ranked = trending.results
    .slice(0, 20)
    .map((movie, index) => {
      const isInTheaters = nowPlayingIds.has(movie.id);
      return {
        movie,
        trendingIndex: index,
        isInTheaters,
        score: scoreMovieOfTheWeekCandidate(movie, index, isInTheaters),
      };
    })
    .sort((a, b) => b.score - a.score);

  const pick = ranked[0];

  return {
    movie: pick.movie,
    weekLabel: getCurrentWeekLabel(),
    trendingRank: pick.trendingIndex + 1,
    isInTheaters: pick.isInTheaters,
  };
}

export async function getPopularMovies(page = 1): Promise<TMDbListResponse<Movie>> {
  return tmdbFetch<TMDbListResponse<Movie>>("/movie/popular", { page });
}

export async function getTopRatedMovies(page = 1): Promise<TMDbListResponse<Movie>> {
  return tmdbFetch<TMDbListResponse<Movie>>("/movie/top_rated", { page });
}

export async function getUpcomingMovies(page = 1): Promise<TMDbListResponse<Movie>> {
  return tmdbFetch<TMDbListResponse<Movie>>("/movie/upcoming", { page });
}

export async function getNowPlayingMovies(page = 1): Promise<TMDbListResponse<Movie>> {
  return tmdbFetch<TMDbListResponse<Movie>>("/movie/now_playing", { page });
}

const NOW_PLAYING_MAX_PAGES = 5;

/** TMDb movie IDs currently in theaters for the configured region. */
export async function getNowPlayingMovieIds(revalidate = 3600): Promise<Set<number>> {
  const first = await tmdbFetch<TMDbListResponse<Movie>>(
    "/movie/now_playing",
    { page: 1 },
    revalidate,
  );

  const ids = new Set(first.results.map((movie) => movie.id));
  const totalPages = Math.min(first.total_pages, NOW_PLAYING_MAX_PAGES);

  if (totalPages > 1) {
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        tmdbFetch<TMDbListResponse<Movie>>(
          "/movie/now_playing",
          { page: index + 2 },
          revalidate,
        ),
      ),
    );

    remaining.forEach((page) => {
      page.results.forEach((movie) => ids.add(movie.id));
    });
  }

  return ids;
}

export async function isMovieInTheaters(movieId: number, revalidate = 3600): Promise<boolean> {
  const ids = await getNowPlayingMovieIds(revalidate);
  return ids.has(movieId);
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  const [movie, credits, similar] = await Promise.all([
    tmdbFetch<MovieDetails>(`/movie/${id}`),
    tmdbFetch<Credits>(`/movie/${id}/credits`),
    tmdbFetch<TMDbListResponse<Movie>>(`/movie/${id}/similar`, { page: 1 }),
  ]);

  return {
    ...movie,
    credits,
    similar: similar.results.slice(0, 12),
  };
}

export async function getMoviesByIds(ids: number[]): Promise<Movie[]> {
  const uniqueIds = [...new Set(ids)].slice(0, 20);
  const movies = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        return await tmdbFetch<Movie>(`/movie/${id}`);
      } catch {
        return null;
      }
    }),
  );
  return movies.filter((movie): movie is Movie => movie !== null);
}

export async function getCollection(id: number): Promise<CollectionDetails> {
  return tmdbFetch<CollectionDetails>(`/collection/${id}`);
}

export async function getMovieGenres(): Promise<{ id: number; name: string }[]> {
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list");
  return data.genres;
}

export async function searchMovies(query: string, page = 1): Promise<TMDbListResponse<Movie>> {
  return tmdbFetch<TMDbListResponse<Movie>>("/search/movie", { query, page });
}

export async function searchMulti(query: string, page = 1): Promise<TMDbListResponse<SearchResult>> {
  return tmdbFetch<TMDbListResponse<SearchResult>>("/search/multi", { query, page });
}

export async function discoverMovies(filters: DiscoverFilters = {}): Promise<TMDbListResponse<Movie>> {
  const sortMap: Record<string, string> = {
    popularity: "popularity.desc",
    rating: "vote_average.desc",
    release_date: "primary_release_date.desc",
    "release_date.asc": "primary_release_date.asc",
  };

  return tmdbFetch<TMDbListResponse<Movie>>("/discover/movie", {
    page: filters.page ?? 1,
    with_genres: filters.genre,
    primary_release_year: filters.year,
    "vote_average.gte": filters.rating,
    sort_by: sortMap[filters.sortBy ?? "popularity"] ?? "popularity.desc",
    include_adult: "false",
  });
}

export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/[<>"'&]/g, "").slice(0, 100);
}

export function isValidMovieId(id: number): boolean {
  return Number.isInteger(id) && id > 0;
}

export function getTmdbRegion(): string {
  return process.env.TMDB_REGION ?? "US";
}

type WatchProvidersResponse = {
  results: Record<
    string,
    {
      link?: string;
      flatrate?: WatchProvider[];
      rent?: WatchProvider[];
      buy?: WatchProvider[];
    }
  >;
};

type VideosResponse = {
  results: MovieVideo[];
};

export async function getWatchProviders(movieId: number): Promise<WatchProviders | null> {
  const region = getTmdbRegion();

  try {
    const data = await tmdbFetch<WatchProvidersResponse>(`/movie/${movieId}/watch/providers`);
    const regional = data.results[region];

    if (!regional) return null;

    return {
      link: regional.link ?? null,
      flatrate: regional.flatrate ?? [],
      rent: regional.rent ?? [],
      buy: regional.buy ?? [],
      region,
    };
  } catch {
    return null;
  }
}

export async function getMovieVideos(movieId: number): Promise<MovieVideo[]> {
  try {
    const data = await tmdbFetch<VideosResponse>(`/movie/${movieId}/videos`);
    return data.results;
  } catch {
    return [];
  }
}

export function pickBestTrailer(videos: MovieVideo[]): MovieVideo | null {
  const youtubeVideos = videos.filter((v) => v.site === "YouTube");

  const trailer =
    youtubeVideos.find((v) => v.type === "Trailer" && v.official) ??
    youtubeVideos.find((v) => v.type === "Trailer") ??
    youtubeVideos.find((v) => v.type === "Teaser") ??
    youtubeVideos[0];

  return trailer ?? null;
}

export async function getMovieReviews(movieId: number, page = 1): Promise<MovieReview[]> {
  try {
    const data = await tmdbFetch<TMDbListResponse<MovieReview>>(`/movie/${movieId}/reviews`, {
      page,
    });
    return data.results;
  } catch {
    return [];
  }
}

export async function getMovieExtras(movie: Movie): Promise<MovieExtras> {
  const [providers, videos, reviews] = await Promise.all([
    getWatchProviders(movie.id),
    getMovieVideos(movie.id),
    getMovieReviews(movie.id),
  ]);

  return {
    providers,
    trailer: pickBestTrailer(videos),
    reviews,
    buzz: buildBuzzSummary(movie, reviews),
  };
}
