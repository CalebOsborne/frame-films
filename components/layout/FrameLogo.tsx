import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/featuredSeries";

type FrameLogoProps = {
  className?: string;
  showTagline?: boolean;
};

export function FrameLogo({ className, showTagline = false }: FrameLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex shrink-0 items-center transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-white">{siteConfig.name}</span>
        {showTagline && (
          <span className="eyebrow mt-1.5">
            Films
          </span>
        )}
      </span>
    </Link>
  );
}
