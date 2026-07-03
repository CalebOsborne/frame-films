export type Movie = {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  belongs_to_collection?: CollectionReference | null;
};

export type Genre = {
  id: number;
  name: string;
};

export type CollectionReference = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

export type MovieDetails = Movie & {
  genres: Genre[];
  runtime: number;
  credits?: Credits;
  similar?: Movie[];
};

export type WatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
};

export type WatchProviders = {
  link: string | null;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
  region: string;
};

export type MovieVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type MovieReview = {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
};

export type BuzzVerdict = "acclaimed" | "positive" | "mixed" | "negative";

export type BuzzSummary = {
  verdict: BuzzVerdict;
  label: string;
  description: string;
  positivePercent: number;
  averageReviewRating: number | null;
  totalReviews: number;
  highlightReviews: MovieReview[];
};

export type MovieExtras = {
  providers: WatchProviders | null;
  trailer: MovieVideo | null;
  reviews: MovieReview[];
  buzz: BuzzSummary;
};

export type Credits = {
  cast: CastMember[];
  crew: CrewMember[];
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type TMDbListResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type DiscoverFilters = {
  genre?: string;
  year?: string;
  rating?: string;
  sortBy?: string;
  page?: number;
};

export type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: "movie" | "person" | "tv";
  known_for_department?: string;
};

export type WatchlistItem = {
  id: number;
  addedAt: string;
};

export type MovieOfTheWeek = {
  movie: Movie;
  weekLabel: string;
  trendingRank: number;
  isInTheaters: boolean;
};
