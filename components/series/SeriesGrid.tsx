import { SeriesCard } from "@/components/series/SeriesCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import type { FeaturedSeries } from "@/types/series";

type SeriesGridProps = {
  series: FeaturedSeries[];
  backdrops?: Record<string, string | null>;
};

export function SeriesGrid({ series, backdrops = {} }: SeriesGridProps) {
  return (
    <section id="movie-series" className="section-y" aria-labelledby="movie-series-heading">
      <Container>
        <div className="section-head">
          <SectionHeading
            id="movie-series-heading"
            eyebrow="Franchises"
            title="Movie Series"
            description="Explore iconic franchises with release and chronological viewing orders."
          />
        </div>

        <div className="grid grid-gap sm:grid-cols-2 lg:grid-cols-3">
          {series.map((item, index) => (
            <SeriesCard
              key={item.slug}
              series={item}
              backdropPath={backdrops[item.slug]}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
