import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,box-shadow,transform,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7365f0]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06060a] disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "rounded-full bg-[#7365f0] text-white shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#8174f2] hover:shadow-[0_4px_20px_rgba(115,101,240,0.28)]",
        secondary:
          "rounded-full border border-white/[0.1] bg-white/[0.03] text-zinc-200 hover:border-white/[0.16] hover:bg-white/[0.06]",
        ghost:
          "rounded-full text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100",
        outline:
          "rounded-full border border-white/[0.1] bg-transparent text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.03] hover:text-white",
        watchlist:
          "rounded-full border border-white/[0.14] bg-black/35 text-zinc-200 backdrop-blur-sm hover:border-white/[0.2] hover:bg-black/45 hover:text-white",
        watchlistActive:
          "watchlist-shimmer shimmer-border rounded-full bg-[#7365f0]/14 text-[#ddd6fe] hover:bg-[#7365f0]/20",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-11 px-7 text-[0.9375rem]",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
