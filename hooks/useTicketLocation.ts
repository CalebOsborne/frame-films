"use client";

import { useCallback, useEffect, useState } from "react";
import { locationFromZip } from "@/lib/geolocation";
import type { TicketLocation } from "@/types/tickets";

const STORAGE_KEY = "cinevault-ticket-location";

type LocationStatus = "idle" | "loading" | "granted" | "denied" | "error";

export function useTicketLocation() {
  const [location, setLocation] = useState<TicketLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLocation(JSON.parse(stored) as TicketLocation);
        setStatus("granted");
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveLocation = useCallback((next: TicketLocation) => {
    setLocation(next);
    setStatus("granted");
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `/api/location/reverse?lat=${latitude}&lon=${longitude}`,
          );

          if (!response.ok) {
            setStatus("error");
            return;
          }

          const data = (await response.json()) as { location: TicketLocation };
          saveLocation({
            ...data.location,
            latitude,
            longitude,
          });
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  }, [saveLocation]);

  const setZip = useCallback(
    (zip: string) => {
      if (!/^\d{5}$/.test(zip.trim())) {
        setStatus("error");
        return false;
      }
      saveLocation(locationFromZip(zip));
      return true;
    },
    [saveLocation],
  );

  const clearLocation = useCallback(() => {
    setLocation(null);
    setStatus("idle");
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    location,
    status,
    requestLocation,
    setZip,
    clearLocation,
  };
}
