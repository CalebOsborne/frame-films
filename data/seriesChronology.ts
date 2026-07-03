import type { SeriesChronology } from "@/types/series";

/**
 * Manually curated story/chronological order using TMDb movie IDs.
 * When unavailable for a series, the UI falls back to release order from TMDb.
 */
export const seriesChronology: SeriesChronology[] = [
  {
    slug: "star-wars",
    note: "Main saga in story order. Additional TMDb collection titles appear in release order.",
    chronologicalOrder: [
      1893, 1894, 1895, 348350, 330459, 11, 1891, 1892, 140607, 181808, 181812,
    ],
  },
  {
    slug: "marvel-cinematic-universe",
    note: "Core Phase 1–3 films in approximate story timeline. The full MCU spans 30+ titles.",
    chronologicalOrder: [
      1726, 1724, 10138, 10195, 1771, 24428, 68721, 76338, 100402, 118340,
      99861, 271110, 284052, 283995, 284053, 315635, 284054, 299536, 363088,
    ],
  },
  {
    slug: "harry-potter",
    chronologicalOrder: [671, 672, 673, 674, 675, 767, 12444, 12445],
  },
  {
    slug: "lord-of-the-rings",
    note: "The Hobbit trilogy followed by The Lord of the Rings trilogy.",
    chronologicalOrder: [49051, 57158, 122917, 120, 121, 122],
  },
  {
    slug: "fast-and-furious",
    note: "Approximate story timeline. Spin-offs and shorts may differ.",
    chronologicalOrder: [
      9849, 584, 13804, 51482, 82992, 9615, 168259, 337339, 385128, 385687,
    ],
  },
  {
    slug: "alien",
    note: "Prequels followed by the original quadrilogy in story order.",
    chronologicalOrder: [70981, 126889, 348, 679, 8077, 8078],
  },
  {
    slug: "planet-of-the-apes",
    note: "Reboot trilogy in story order.",
    chronologicalOrder: [9933, 119450, 281338],
  },
  {
    slug: "toy-story",
    chronologicalOrder: [862, 863, 10193, 301528],
  },
  {
    slug: "shrek",
    chronologicalOrder: [808, 809, 101, 1250359],
  },
];

export function getChronologyForSeries(slug: string): SeriesChronology | undefined {
  return seriesChronology.find((entry) => entry.slug === slug);
}

export function hasChronologicalOrder(slug: string): boolean {
  const entry = getChronologyForSeries(slug);
  return Boolean(entry && entry.chronologicalOrder.length > 0);
}
