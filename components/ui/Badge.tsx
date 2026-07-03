import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/[0.08] bg-white/[0.04] text-zinc-300",
        accent: "border-[#7365f0]/25 bg-[#7365f0]/10 text-[#c4bdf8]",
        rating: "border-white/[0.08] bg-white/[0.04] text-zinc-300",
        ratingOverlay:
          "border-white/15 bg-black/45 text-white backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
