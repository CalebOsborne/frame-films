import type { BuzzSummary, BuzzVerdict, Movie, MovieReview } from "@/types/movie";

const VERDICT_CONFIG: Record<
  BuzzVerdict,
  { label: string; positive: string; negative: string; mixed: string }
> = {
  acclaimed: {
    label: "Widely Acclaimed",
    positive: "Critics and audiences are raving about this one.",
    negative: "",
    mixed: "",
  },
  positive: {
    label: "Generally Positive",
    positive: "Most viewers are enjoying this film.",
    negative: "",
    mixed: "",
  },
  mixed: {
    label: "Mixed Reception",
    positive: "",
    negative: "",
    mixed: "Opinions are split — some love it, others don't.",
  },
  negative: {
    label: "Poor Reception",
    positive: "",
    negative: "Reviews suggest this one may be a miss.",
    mixed: "",
  },
};

function getVerdictFromRating(voteAverage: number, voteCount: number): BuzzVerdict {
  if (voteCount < 20) {
    if (voteAverage >= 7) return "positive";
    if (voteAverage >= 5.5) return "mixed";
    return "negative";
  }

  if (voteAverage >= 7.5) return "acclaimed";
  if (voteAverage >= 6.5) return "positive";
  if (voteAverage >= 5) return "mixed";
  return "negative";
}

function getReviewSentimentPercent(reviews: MovieReview[]): number {
  const rated = reviews.filter((r) => r.author_details.rating !== null);
  if (rated.length === 0) return 0;

  const positive = rated.filter((r) => (r.author_details.rating ?? 0) >= 6).length;
  return Math.round((positive / rated.length) * 100);
}

function getAverageReviewRating(reviews: MovieReview[]): number | null {
  const rated = reviews.filter((r) => r.author_details.rating !== null);
  if (rated.length === 0) return null;

  const sum = rated.reduce((acc, r) => acc + (r.author_details.rating ?? 0), 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

function refineVerdict(
  base: BuzzVerdict,
  positivePercent: number,
  averageReviewRating: number | null,
): BuzzVerdict {
  if (averageReviewRating === null) return base;

  if (averageReviewRating >= 7.5 && positivePercent >= 70) return "acclaimed";
  if (averageReviewRating >= 6.5 && positivePercent >= 55) return "positive";
  if (averageReviewRating < 5 || positivePercent < 40) return "negative";
  if (positivePercent >= 40 && positivePercent <= 60) return "mixed";

  return base;
}

export function buildBuzzSummary(movie: Movie, reviews: MovieReview[]): BuzzSummary {
  const positivePercent = getReviewSentimentPercent(reviews);
  const averageReviewRating = getAverageReviewRating(reviews);
  const baseVerdict = getVerdictFromRating(movie.vote_average, movie.vote_count);
  const verdict = refineVerdict(baseVerdict, positivePercent, averageReviewRating);

  const config = VERDICT_CONFIG[verdict];
  let description = config.positive || config.negative || config.mixed;

  if (reviews.length > 0 && positivePercent > 0) {
    description = `${positivePercent}% of TMDb reviews rated 6/10 or higher. ${description}`;
  } else if (movie.vote_count > 0) {
    description = `Rated ${movie.vote_average.toFixed(1)}/10 from ${movie.vote_count.toLocaleString()} TMDb votes. ${description}`;
  }

  const highlightReviews = [...reviews]
    .sort((a, b) => {
      const aRating = a.author_details.rating ?? 0;
      const bRating = b.author_details.rating ?? 0;
      return bRating - aRating;
    })
    .slice(0, 4);

  return {
    verdict,
    label: config.label,
    description,
    positivePercent,
    averageReviewRating,
    totalReviews: reviews.length,
    highlightReviews,
  };
}

export function getVerdictColor(verdict: BuzzVerdict): string {
  switch (verdict) {
    case "acclaimed":
      return "text-violet-200 border-violet-400/30 bg-violet-500/10";
    case "positive":
      return "text-purple-200 border-purple-400/30 bg-purple-500/10";
    case "mixed":
      return "text-violet-300/80 border-violet-500/25 bg-violet-500/10";
    case "negative":
      return "text-purple-400/70 border-purple-600/25 bg-purple-700/10";
  }
}
