"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Clock, Loader2, MapPin, Star, Ticket, X } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useSavedTheaters } from "@/hooks/useSavedTheaters";
import { useTicketLocation } from "@/hooks/useTicketLocation";
import { sortTheatersWithSavedFirst } from "@/lib/savedTheaters";
import { cn } from "@/lib/utils";
import type { NearbyShowtimesResult } from "@/types/tickets";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type GetTicketsProps = {
  title: string;
  releaseDate?: string;
  compact?: boolean;
  id?: string;
  defaultOpen?: boolean;
};

function formatShowDate(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function GetTickets({
  title,
  releaseDate,
  compact = false,
  id = "get-tickets",
  defaultOpen = false,
}: GetTicketsProps) {
  const mounted = useMounted();
  const { location, status, requestLocation, setZip, clearLocation } = useTicketLocation();
  const { savedTheaters, toggleSavedTheater, isTheaterSaved } = useSavedTheaters();
  const [open, setOpen] = useState(defaultOpen);
  const [zipInput, setZipInput] = useState("");
  const [zipError, setZipError] = useState(false);
  const [showtimes, setShowtimes] = useState<NearbyShowtimesResult | null>(null);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [showtimesError, setShowtimesError] = useState<string | null>(null);

  const sortedTheaters = useMemo(
    () => (showtimes ? sortTheatersWithSavedFirst(showtimes.theaters, savedTheaters) : []),
    [showtimes, savedTheaters],
  );

  const loadShowtimes = useCallback(async (zip: string) => {
    setLoadingShowtimes(true);
    setShowtimesError(null);

    try {
      const params = new URLSearchParams({ zip, title });
      const response = await fetch(`/api/showtimes?${params}`);

      if (!response.ok) {
        setShowtimes(null);
        setShowtimesError("Could not load showtimes right now. Try again in a moment.");
        return;
      }

      const data = (await response.json()) as NearbyShowtimesResult;
      setShowtimes(data);
    } catch {
      setShowtimes(null);
      setShowtimesError("Could not load showtimes right now. Try again in a moment.");
    } finally {
      setLoadingShowtimes(false);
    }
  }, [title]);

  useEffect(() => {
    if (location?.zip) {
      loadShowtimes(location.zip);
    } else {
      setShowtimes(null);
      setShowtimesError(null);
    }
  }, [location?.zip, loadShowtimes]);

  useEffect(() => {
    const expandIfTargeted = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };

    expandIfTargeted();
    window.addEventListener("hashchange", expandIfTargeted);
    return () => window.removeEventListener("hashchange", expandIfTargeted);
  }, [id]);

  function handleZipSubmit(event: FormEvent) {
    event.preventDefault();
    const ok = setZip(zipInput);
    setZipError(!ok);
    if (ok) setZipInput("");
  }

  return (
    <div
      id={id}
      className={cn(
        "scroll-mt-28",
        compact ? "space-y-5" : "glass-card glass-padding rounded-2xl",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Ticket className="h-5 w-5 shrink-0 text-violet-400" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white sm:text-xl">Get Tickets</h2>
            <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-200">
              Now Playing
            </Badge>
          </div>
          <p className="mt-1.5 text-sm text-zinc-500">
            {open
              ? location
                ? `Pick a showtime near ${location.label} for ${title}`
                : `Share your location to see nearby theaters and showtimes`
              : "Find showtimes near you — expand to browse theaters"}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={`${id}-panel`} className="mt-4 space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        {location ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <MapPin className="h-4 w-4 text-violet-400" aria-hidden="true" />
              <span>
                Near <span className="font-medium text-white">{location.label}</span>
              </span>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={clearLocation}>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Change
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              Share your location or enter a zip code to browse showtimes at theaters near you.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={requestLocation}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                )}
                Use my location
              </Button>
            </div>
            <form onSubmit={handleZipSubmit} className="flex flex-wrap gap-2">
              <label htmlFor={`${id}-zip`} className="sr-only">
                Zip code
              </label>
              <input
                id={`${id}-zip`}
                inputMode="numeric"
                pattern="\d{5}"
                maxLength={5}
                placeholder="Enter zip code"
                value={zipInput}
                onChange={(e) => {
                  setZipInput(e.target.value.replace(/\D/g, "").slice(0, 5));
                  setZipError(false);
                }}
                className="h-9 w-32 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/40 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <Button type="submit" variant="secondary" size="sm" disabled={zipInput.length !== 5}>
                Set location
              </Button>
            </form>
            {status === "denied" && (
              <p className="text-xs text-zinc-500">
                Location access was denied. You can enter a zip code instead.
              </p>
            )}
            {(status === "error" || zipError) && (
              <p className="text-xs text-red-400/90">
                Could not detect your location. Try a valid 5-digit US zip code.
              </p>
            )}
          </div>
        )}
      </div>

      {location && (
        <div className="space-y-4">
          {loadingShowtimes && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading nearby showtimes…
            </div>
          )}

          {showtimesError && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {showtimesError}
            </p>
          )}

          {!loadingShowtimes && showtimes && showtimes.theaters.length === 0 && (
            <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-zinc-400">
              No showtimes found for <span className="text-white">{title}</span> near{" "}
              {location.label} today. Try another zip or check back later.
            </p>
          )}

          {showtimes && showtimes.theaters.length > 0 && (
            <p className="text-xs text-zinc-500">
              Showing times for {formatShowDate(showtimes.date)} · Tap a time to buy on Fandango
              {savedTheaters.length > 0 ? " · Saved theaters appear first" : ""}
            </p>
          )}

          <ul className="space-y-4">
            {sortedTheaters.map((theater, index) => {
              const saved = isTheaterSaved(theater.id);

              return (
              <motion.li
                key={theater.id}
                initial={mounted ? { opacity: 0, y: 10 } : false}
                whileInView={mounted ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className={cn(
                  "rounded-xl border bg-white/[0.02] p-4 sm:p-5",
                  saved ? "border-violet-500/30 bg-violet-500/[0.04]" : "border-white/10",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSavedTheater(theater)}
                      aria-label={
                        saved
                          ? `Remove ${theater.name} from saved theaters`
                          : `Save ${theater.name}`
                      }
                      aria-pressed={saved}
                      className="mt-0.5 shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-violet-300"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          saved ? "fill-violet-400 text-violet-300" : "text-zinc-500",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{theater.name}</p>
                        {saved && (
                          <Badge className="border-violet-500/25 bg-violet-500/10 text-violet-200">
                            Saved
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {theater.address}
                        {theater.cityStateZip ? ` · ${theater.cityStateZip}` : ""}
                      </p>
                      {theater.chainName && (
                        <p className="mt-1 text-xs text-violet-300/80">{theater.chainName}</p>
                      )}
                    </div>
                  </div>
                  <Badge className="shrink-0 border-white/10 bg-white/5 text-zinc-300">
                    {theater.distanceMiles} mi
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {theater.showtimes.map((showtime) => (
                    <button
                      key={showtime.id}
                      type="button"
                      disabled={showtime.soldOut}
                      onClick={() => window.open(showtime.ticketUrl, "_blank", "noopener,noreferrer")}
                      title={
                        showtime.soldOut
                          ? "Sold out"
                          : `Buy on Fandango · ${showtime.screenReaderTime}${showtime.format ? ` · ${showtime.format}` : ""}`
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        showtime.soldOut
                          ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-zinc-600 line-through"
                          : "border-violet-500/25 bg-violet-500/10 text-violet-200 hover:border-violet-400/40 hover:bg-violet-500/15",
                      )}
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{showtime.time}</span>
                      {showtime.format && (
                        <span className="text-xs text-zinc-500">· {showtime.format}</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      <p className="text-xs leading-relaxed text-zinc-600">
        Showtimes are sourced from Fandango. You&apos;ll only leave Frame when you pick a time.
      </p>
        </div>
      )}
    </div>
  );
}
