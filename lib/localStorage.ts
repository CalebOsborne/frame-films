import type { WatchlistItem } from "@/types/movie";

const WATCHLIST_KEY = "cinevault-watchlist";

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as WatchlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(items: WatchlistItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
}

export function isInWatchlist(movieId: number): boolean {
  return getWatchlist().some((item) => item.id === movieId);
}

export function addToWatchlist(movieId: number): WatchlistItem[] {
  const current = getWatchlist();
  if (current.some((item) => item.id === movieId)) return current;

  const updated = [{ id: movieId, addedAt: new Date().toISOString() }, ...current];
  saveWatchlist(updated);
  return updated;
}

export function removeFromWatchlist(movieId: number): WatchlistItem[] {
  const updated = getWatchlist().filter((item) => item.id !== movieId);
  saveWatchlist(updated);
  return updated;
}

export function toggleWatchlist(movieId: number): { items: WatchlistItem[]; added: boolean } {
  if (isInWatchlist(movieId)) {
    return { items: removeFromWatchlist(movieId), added: false };
  }
  return { items: addToWatchlist(movieId), added: true };
}
