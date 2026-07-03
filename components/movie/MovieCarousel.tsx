"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { MovieCard } from "@/components/movie/MovieCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { Movie } from "@/types/movie";

type MovieCarouselProps = {
  title: string;
  movies: Movie[];
  eyebrow?: string;
  description?: string;
  genres?: { id: number; name: string }[];
  id?: string;
};

export function MovieCarousel({
  title,
  movies,
  eyebrow,
  description,
  genres,
  id,
}: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (movies.length === 0) return null;

  return (
    <section aria-labelledby={id ?? title.replace(/\s+/g, "-").toLowerCase()}>
      <div className="section-head flex items-end justify-between gap-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} id={id} />
        <div className="hidden shrink-0 gap-1.5 sm:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scroll-touch scrollbar-hide -mx-5 flex gap-6 overflow-x-auto px-5 pb-1 pt-0.5 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {movies.map((movie, index) => (
          <div key={movie.id} className="w-40 shrink-0 sm:w-44 md:w-48">
            <MovieCard movie={movie} genres={genres} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
