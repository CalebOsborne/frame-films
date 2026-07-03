"use client";

import { useCallback, useEffect, useState } from "react";
import { getSavedTheaters, toggleSavedTheater } from "@/lib/savedTheaters";
import type { SavedTheater, TheaterShowtimes } from "@/types/tickets";

export function useSavedTheaters() {
  const [savedTheaters, setSavedTheaters] = useState<SavedTheater[]>([]);

  useEffect(() => {
    setSavedTheaters(getSavedTheaters());
  }, []);

  const toggle = useCallback((theater: Pick<TheaterShowtimes, "id" | "name">) => {
    const { items } = toggleSavedTheater(theater);
    setSavedTheaters(items);
  }, []);

  const checkSaved = useCallback(
    (theaterId: string) => savedTheaters.some((item) => item.id === theaterId),
    [savedTheaters],
  );

  return {
    savedTheaters,
    toggleSavedTheater: toggle,
    isTheaterSaved: checkSaved,
  };
}
