import { cn } from "@/lib/utils";

type SkeletonCardProps = {
  className?: string;
  variant?: "poster" | "backdrop" | "row";
};

export function SkeletonCard({ className, variant = "poster" }: SkeletonCardProps) {
  if (variant === "backdrop") {
    return (
      <div className={cn("skeleton-shimmer aspect-[16/9] w-full rounded-2xl", className)} />
    );
  }

  if (variant === "row") {
    return (
      <div className={cn("flex gap-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer aspect-[2/3] w-40 shrink-0 rounded-xl sm:w-44"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("skeleton-shimmer aspect-[2/3] w-full rounded-xl", className)} />
  );
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
