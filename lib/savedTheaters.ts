import type { SavedTheater, TheaterShowtimes } from "@/types/tickets";

const STORAGE_KEY = "cinevault-saved-theaters";

export function getSavedTheaters(): SavedTheater[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as SavedTheater[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSavedTheaters(items: SavedTheater[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isTheaterSaved(theaterId: string): boolean {
  return getSavedTheaters().some((item) => item.id === theaterId);
}

export function toggleSavedTheater(theater: Pick<TheaterShowtimes, "id" | "name">): {
  items: SavedTheater[];
  added: boolean;
} {
  const current = getSavedTheaters();
  const exists = current.some((item) => item.id === theater.id);

  if (exists) {
    const items = current.filter((item) => item.id !== theater.id);
    saveSavedTheaters(items);
    return { items, added: false };
  }

  const items = [
    { id: theater.id, name: theater.name, savedAt: new Date().toISOString() },
    ...current,
  ];
  saveSavedTheaters(items);
  return { items, added: true };
}

export function sortTheatersWithSavedFirst(
  theaters: TheaterShowtimes[],
  savedTheaters: SavedTheater[],
): TheaterShowtimes[] {
  const savedAtById = new Map(savedTheaters.map((item) => [item.id, item.savedAt]));

  return [...theaters].sort((a, b) => {
    const aSaved = savedAtById.has(a.id);
    const bSaved = savedAtById.has(b.id);

    if (aSaved !== bSaved) return aSaved ? -1 : 1;
    if (aSaved && bSaved) {
      return (
        new Date(savedAtById.get(b.id)!).getTime() - new Date(savedAtById.get(a.id)!).getTime()
      );
    }
    return 0;
  });
}
