import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SeriesPageClient } from "@/components/series/SeriesPageClient";
import { Container } from "@/components/ui/Container";
import { getSeriesBySlug } from "@/data/featuredSeries";
import { getCollection, getCollectionBackdropPath, getImageUrl, TMDbError } from "@/lib/tmdb";

type SeriesPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) {
    return { title: "Series Not Found" };
  }

  return {
    title: series.name,
    description: series.description,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  try {
    const collection = await getCollection(series.collectionId);

    return (
      <>
        <section className="relative min-h-[40vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(getCollectionBackdropPath(collection), "backdrop", "xl")}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-zinc-950/75" />
            <div className="absolute inset-0 cinematic-gradient" />
          </div>

          <Container className="relative flex min-h-[40vh] items-end hero-top pb-16 sm:pb-20">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-medium tracking-[0.2em] text-violet-400/80 uppercase">
                Movie Series
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {collection.name}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-zinc-400">
                {collection.overview || series.description}
              </p>
              <p className="mt-3 text-sm text-zinc-500">
                {collection.parts.length} films in collection
              </p>
            </div>
          </Container>
        </section>

        <SeriesPageClient slug={slug} collection={collection} />
      </>
    );
  } catch (error) {
    if (error instanceof TMDbError) {
      notFound();
    }
    throw error;
  }
}
