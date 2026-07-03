import type { Metadata } from "next";
import { WatchlistClient } from "@/components/movie/WatchlistClient";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "Your saved movies, stored locally on this device.",
};

export default function WatchlistPage() {
  return <WatchlistClient />;
}
