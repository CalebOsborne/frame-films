import type { FeaturedSeries } from "@/types/series";

export const siteConfig = {
  name: "Frame",
  tagline: "Discover films worth watching.",
  description:
    "A premium movie discovery experience powered by TMDb. Explore trending films, new releases, franchises, and build your personal watchlist.",
  url: "https://frame-films.vercel.app",
};

export const featuredSeries: FeaturedSeries[] = [
  {
    slug: "star-wars",
    name: "Star Wars",
    description: "The legendary space saga spanning generations of heroes and villains.",
    collectionId: 10,
    accentColor: "#fbbf24",
  },
  {
    slug: "marvel-cinematic-universe",
    name: "Marvel Cinematic Universe",
    description: "Earth's mightiest heroes united across an epic interconnected universe.",
    collectionId: 86311,
    accentColor: "#ef4444",
  },
  {
    slug: "harry-potter",
    name: "Harry Potter",
    description: "The magical journey of the Boy Who Lived and the wizarding world.",
    collectionId: 1241,
    accentColor: "#a855f7",
  },
  {
    slug: "lord-of-the-rings",
    name: "The Lord of the Rings",
    description: "An epic fantasy trilogy set in the world of Middle-earth.",
    collectionId: 119,
    accentColor: "#22c55e",
  },
  {
    slug: "fast-and-furious",
    name: "Fast & Furious",
    description: "High-octane heists, family, and street racing across the globe.",
    collectionId: 9485,
    accentColor: "#f97316",
  },
  {
    slug: "jurassic-park",
    name: "Jurassic Park",
    description: "Prehistoric wonders and chaos at the world's most ambitious theme park.",
    collectionId: 328,
    accentColor: "#84cc16",
  },
  {
    slug: "mission-impossible",
    name: "Mission: Impossible",
    description: "Death-defying stunts and impossible missions with Ethan Hunt.",
    collectionId: 87359,
    accentColor: "#06b6d4",
  },
  {
    slug: "batman",
    name: "Batman",
    description: "The Dark Knight's crusade against crime in Gotham City.",
    collectionId: 263,
    accentColor: "#6366f1",
  },
  {
    slug: "spider-man",
    name: "Spider-Man",
    description: "The wall-crawler's adventures across multiple eras and universes.",
    collectionId: 556,
    accentColor: "#ef4444",
  },
  {
    slug: "planet-of-the-apes",
    name: "Planet of the Apes",
    description: "A saga of evolution, rebellion, and survival across timelines.",
    collectionId: 173710,
    accentColor: "#78716c",
  },
  {
    slug: "alien",
    name: "Alien",
    description: "Sci-fi horror in the depths of space — in space, no one can hear you scream.",
    collectionId: 8091,
    accentColor: "#64748b",
  },
  {
    slug: "predator",
    name: "Predator",
    description: "The ultimate hunter stalks prey across jungles, cities, and beyond.",
    collectionId: 399,
    accentColor: "#16a34a",
  },
  {
    slug: "the-conjuring",
    name: "The Conjuring",
    description: "The Warrens investigate paranormal cases in a shared horror universe.",
    collectionId: 313086,
    accentColor: "#991b1b",
  },
  {
    slug: "toy-story",
    name: "Toy Story",
    description: "Beloved toys come to life in Pixar's groundbreaking animated franchise.",
    collectionId: 10194,
    accentColor: "#eab308",
  },
  {
    slug: "shrek",
    name: "Shrek",
    description: "A fairy tale subversion with ogres, donkeys, and happily ever after.",
    collectionId: 2150,
    accentColor: "#22c55e",
  },
];

export function getSeriesBySlug(slug: string): FeaturedSeries | undefined {
  return featuredSeries.find((series) => series.slug === slug);
}

export function getSeriesSlugByCollectionId(collectionId: number): string | undefined {
  return featuredSeries.find((series) => series.collectionId === collectionId)?.slug;
}
