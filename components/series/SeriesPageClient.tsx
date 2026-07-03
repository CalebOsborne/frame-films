"use client";

import { SeriesMovieList } from "@/components/series/SeriesMovieList";
import { SeriesOrderToggle } from "@/components/series/SeriesOrderToggle";
import { Container } from "@/components/ui/Container";
import { getChronologyForSeries, hasChronologicalOrder } from "@/data/seriesChronology";
import type { CollectionDetails } from "@/types/series";
import type { SeriesSortMode } from "@/types/series";
import { useMemo, useState } from "react";

type SeriesPageClientProps = {
  slug: string;
  collection: CollectionDetails;
};

export function SeriesPageClient({ slug, collection }: SeriesPageClientProps) {
  const [mode, setMode] = useState<SeriesSortMode>("release");
  const chronologyAvailable = hasChronologicalOrder(slug);
  const chronology = getChronologyForSeries(slug);

  const sortedMovies = useMemo(() => {
    const parts = [...collection.parts];

    if (mode === "release") {
      return parts.sort(
        (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
      );
    }

    if (!chronology?.chronologicalOrder.length) {
      return parts.sort(
        (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
      );
    }

    const orderMap = new Map(chronology.chronologicalOrder.map((id, index) => [id, index]));
    const ordered = parts
      .filter((movie) => orderMap.has(movie.id))
      .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));

    const unordered = parts
      .filter((movie) => !orderMap.has(movie.id))
      .sort(
        (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime(),
      );

    return [...ordered, ...unordered];
  }, [collection.parts, mode, chronology]);

  const orderLabel = mode === "release" ? "release order" : "chronological order";

  return (
    <Container className="section-y pt-0">
      <div className="section-head space-y-3">
        <SeriesOrderToggle
          mode={mode}
          onChange={setMode}
          hasChronological={chronologyAvailable}
        />
        {mode === "chronological" && !chronologyAvailable && (
          <p className="max-w-3xl text-xs leading-relaxed text-violet-400/80 sm:text-sm">
            Chronological order unavailable — showing release order.
          </p>
        )}
        {mode === "chronological" && chronology?.note && (
          <p className="max-w-3xl text-xs leading-relaxed text-zinc-500 sm:text-sm">
            {chronology.note}
          </p>
        )}
      </div>

      <SeriesMovieList movies={sortedMovies} orderLabel={orderLabel} />
    </Container>
  );
}
