"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/tmdb";
import type { MovieVideo } from "@/types/movie";

type MovieTrailerProps = {
  trailer: MovieVideo | null;
  movieTitle: string;
  backdropPath?: string | null;
};

export function MovieTrailer({ trailer, movieTitle, backdropPath }: MovieTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useYoutubeThumb, setUseYoutubeThumb] = useState(!backdropPath);

  if (!trailer) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Trailer</h2>
        <p className="mt-2 text-sm text-zinc-500">No trailer available for this title.</p>
      </div>
    );
  }

  const thumbnailUrl = useYoutubeThumb
    ? `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`
    : getImageUrl(backdropPath, "backdrop", "md");

  return (
    <div className="glass-card overflow-hidden rounded-[1.125rem]">
      <div className="border-b border-white/[0.05] px-6 py-4">
        <p className="eyebrow mb-1.5">Watch</p>
        <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white">Trailer</h2>
        <p className="mt-1 text-sm text-[#6b6b76]">{trailer.name}</p>
      </div>

      <div className="relative aspect-video bg-zinc-900">
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <iframe
                title={`${movieTitle} trailer`}
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                aria-label="Close trailer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="thumbnail"
              type="button"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlaying(true)}
              className="group absolute inset-0 w-full"
              aria-label={`Play ${movieTitle} trailer`}
            >
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                unoptimized={useYoutubeThumb}
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => {
                  if (!useYoutubeThumb) {
                    setUseYoutubeThumb(true);
                  }
                }}
              />
              <div className="absolute inset-0 bg-[#06060a]/35 transition-colors duration-300 group-hover:bg-[#06060a]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-[#06060a] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out group-hover:scale-105">
                  <Play className="h-6 w-6 fill-current pl-0.5" aria-hidden="true" />
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
