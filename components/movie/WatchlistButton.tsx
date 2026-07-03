"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type WatchlistButtonProps = {
  saved: boolean;
  onClick: () => void;
  size?: "default" | "lg";
  className?: string;
};

export function WatchlistButton({ saved, onClick, size = "default", className }: WatchlistButtonProps) {
  return (
    <Button
      variant={saved ? "watchlistActive" : "watchlist"}
      size={size}
      onClick={onClick}
      aria-pressed={saved}
      className={className}
    >
      <Plus
        className={cn("h-4 w-4 transition-transform duration-200", saved && "rotate-45")}
        aria-hidden="true"
      />
      {saved ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  );
}
