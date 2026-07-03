export type FeaturedSeries = {
  slug: string;
  name: string;
  description: string;
  collectionId: number;
  posterPath?: string;
  accentColor?: string;
};

export type SeriesChronology = {
  slug: string;
  /** TMDb movie IDs in story/chronological order */
  chronologicalOrder: number[];
  /** Optional note shown in UI when chronological differs from release */
  note?: string;
};

export type SeriesSortMode = "release" | "chronological";

export type CollectionMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
};

export type CollectionDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: CollectionMovie[];
};
