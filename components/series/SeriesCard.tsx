"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMounted } from "@/hooks/useMounted";
import { getImageUrl } from "@/lib/tmdb";
import type { FeaturedSeries } from "@/types/series";

type SeriesCardProps = {
  series: FeaturedSeries;
  backdropPath?: string | null;
  index?: number;
};

export function SeriesCard({ series, backdropPath, index = 0 }: SeriesCardProps) {
  const mounted = useMounted();

  return (
    <motion.article
      initial={mounted ? { opacity: 0, y: 16 } : false}
      whileInView={mounted ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        href={`/series/${series.slug}`}
        className="block overflow-hidden rounded-[1.125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7365f0]/40"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.125rem] bg-[#0e0d14] ring-1 ring-white/[0.06] transition-[box-shadow,ring-color] duration-300 group-hover:ring-white/[0.12] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
          <Image
            src={getImageUrl(backdropPath, "backdrop", "md")}
            alt={`${series.name} collection`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-[#06060a]/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-white transition-colors duration-200 group-hover:text-zinc-50">
              {series.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-[#9494a0]">{series.description}</p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
