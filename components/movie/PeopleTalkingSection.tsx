"use client";

import { motion } from "framer-motion";
import { MessageCircle, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";
import { getVerdictColor } from "@/lib/sentiment";
import { formatRating } from "@/lib/tmdb";
import type { BuzzSummary, Movie, MovieExtras } from "@/types/movie";
import { StreamingProviders } from "@/components/movie/StreamingProviders";
import { Container } from "@/components/ui/Container";

type PeopleTalkingSectionProps = {
  movie: Movie;
  extras: Pick<MovieExtras, "buzz" | "reviews" | "providers">;
  variant?: "featured" | "detail";
};

function VerdictBadge({ buzz }: { buzz: BuzzSummary }) {
  const colorClass = getVerdictColor(buzz.verdict);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold",
        colorClass,
      )}
    >
      {buzz.verdict === "negative" ? (
        <ThumbsDown className="h-4 w-4" aria-hidden="true" />
      ) : (
        <ThumbsUp className="h-4 w-4" aria-hidden="true" />
      )}
      {buzz.label}
    </span>
  );
}

function ReviewSnippet({
  author,
  content,
  rating,
}: {
  author: string;
  content: string;
  rating: number | null;
}) {
  const snippet = content.length > 240 ? `${content.slice(0, 240).trim()}…` : content;

  return (
    <blockquote className="rounded-[0.875rem] border border-white/[0.06] bg-white/[0.02] p-5">
      <p className="text-sm leading-relaxed text-zinc-400 line-clamp-5">&ldquo;{snippet}&rdquo;</p>
      <footer className="mt-3 flex items-center justify-between gap-2">
        <cite className="text-xs font-medium text-zinc-300 not-italic">— {author}</cite>
        {rating !== null && (
          <span className="inline-flex items-center gap-1 text-xs text-violet-300">
            <Star className="h-3 w-3 fill-violet-400" aria-hidden="true" />
            {formatRating(rating)}
          </span>
        )}
      </footer>
    </blockquote>
  );
}

export function PeopleTalkingSection({
  movie,
  extras,
  variant = "detail",
}: PeopleTalkingSectionProps) {
  const mounted = useMounted();
  const { buzz, reviews, providers } = extras;
  const isFeatured = variant === "featured";

  return (
    <section
      aria-labelledby="people-talking-heading"
      className={cn(
        isFeatured && "section-y hidden border-y border-white/5 bg-zinc-950/50 md:block",
      )}
    >
      <Container className={cn(!isFeatured && "contents")}>
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={mounted ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-head flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-2.5 flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                What People Are Saying
              </p>
              <h2
                id="people-talking-heading"
                className="text-[1.625rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.875rem]"
              >
                {isFeatured ? `Is "${movie.title}" worth watching?` : "Audience Buzz"}
              </h2>
            </div>
            <VerdictBadge buzz={buzz} />
          </div>

          <div className="glass-card glass-padding rounded-[1.125rem]">
            <p className="text-base leading-relaxed text-zinc-300">{buzz.description}</p>

            <dl className="mt-8 grid grid-gap sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <dt className="text-xs text-zinc-500">TMDb Score</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-2xl font-semibold text-white">
                  <Star className="h-5 w-5 fill-violet-400 text-violet-300" aria-hidden="true" />
                  {formatRating(movie.vote_average)}
                </dd>
              </div>
              {buzz.averageReviewRating !== null && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <dt className="text-xs text-zinc-500">Avg. Review Score</dt>
                  <dd className="mt-1 text-2xl font-semibold text-white">
                    {formatRating(buzz.averageReviewRating)}/10
                  </dd>
                </div>
              )}
              {buzz.positivePercent > 0 && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <dt className="text-xs text-zinc-500">Positive Reviews</dt>
                  <dd className="mt-1 text-2xl font-semibold text-violet-300">
                    {buzz.positivePercent}%
                  </dd>
                </div>
              )}
            </dl>

            {buzz.highlightReviews.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold text-zinc-300">Highlighted Takes</h3>
                <div className="grid grid-gap sm:grid-cols-2">
                  {buzz.highlightReviews.map((review) => (
                    <ReviewSnippet
                      key={review.id}
                      author={review.author}
                      content={review.content}
                      rating={review.author_details.rating}
                    />
                  ))}
                </div>
              </div>
            )}

            {reviews.length === 0 && (
              <p className="mt-6 text-sm text-zinc-500">
                No written reviews yet — the verdict is based on TMDb community ratings (
                {movie.vote_count.toLocaleString()} votes).
              </p>
            )}
          </div>

          {isFeatured && providers && (
            <div className="mt-8">
              <StreamingProviders providers={providers} compact />
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
