"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import { formatRating } from "@/lib/tmdb";
import type { MovieReview } from "@/types/movie";

type MovieReviewsProps = {
  reviews: MovieReview[];
};

function ReviewCard({ review }: { review: MovieReview }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.content.length > 280;
  const displayContent =
    expanded || !isLong ? review.content : `${review.content.slice(0, 280).trim()}…`;

  const formattedDate = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:border-white/10 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-white">{review.author}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{formattedDate}</p>
        </div>
        {review.author_details.rating !== null && (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/25 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-200">
            <Star className="h-3 w-3 fill-violet-400 text-violet-300" aria-hidden="true" />
            {formatRating(review.author_details.rating)}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-zinc-400">
        {displayContent}
      </p>

      <div className="mt-4 flex items-center gap-4">
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Full review on TMDb
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export function MovieReviews({ reviews }: MovieReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="glass-card glass-padding rounded-2xl">
        <h2 className="text-lg font-semibold text-white">Reviews</h2>
        <p className="mt-3 text-sm text-zinc-500">No written reviews available on TMDb yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-head">
        <h2 className="text-xl font-semibold text-white">Reviews</h2>
        <p className="mt-2 text-sm text-zinc-500">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} from TMDb contributors
        </p>
      </div>

      <div className="grid grid-gap lg:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
