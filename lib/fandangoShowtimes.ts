import type { NearbyShowtimesResult, ShowtimeSlot, TheaterShowtimes } from "@/types/tickets";

const FANDANGO_ORIGIN = "https://www.fandango.com";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type FandangoShowtime = {
  id?: number;
  date?: string;
  screenReaderTime?: string;
  showtimeHashCode?: string;
  type?: string;
  ticketingJumpPageURL?: string;
  ticketingDate?: string;
  filmFormat?: { filterName?: string }[];
};

type FandangoMovie = {
  id?: number;
  title?: string;
  mopURI?: string;
  variants?: { amenityGroups?: { showtimes?: FandangoShowtime[] }[] }[];
};

type FandangoTheater = {
  id?: string | number;
  name?: string;
  chainCode?: string;
  chainName?: string;
  address1?: string;
  cityStateZip?: string;
  distance?: number;
  theaterPageUrl?: string;
  movies?: FandangoMovie[];
};

type FandangoTheatersResponse = {
  theaters?: FandangoTheater[];
};

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(\d{4}\)/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function movieTitlesMatch(queryTitle: string, fandangoTitle: string): boolean {
  const query = normalizeTitle(queryTitle);
  const candidate = normalizeTitle(fandangoTitle);
  if (!query || !candidate) return false;
  return query === candidate || candidate.includes(query) || query.includes(candidate);
}

async function getFandangoCookies(): Promise<string> {
  const response = await fetch(FANDANGO_ORIGIN, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 3600 },
  });
  return (response.headers.getSetCookie?.() ?? []).map((cookie) => cookie.split(";")[0]).join("; ");
}

async function fetchTheatersPage(
  zip: string,
  date: string,
  page: number,
  cookies: string,
): Promise<FandangoTheater[]> {
  const params = new URLSearchParams({
    zipCode: zip,
    city: "",
    state: "",
    date,
    page: String(page),
    favTheaterOnly: "false",
    limit: "25",
    isdesktop: "true",
  });

  const response = await fetch(`${FANDANGO_ORIGIN}/napi/theaterswithshowtimes?${params}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Cookie: cookies,
      Accept: "application/json",
      Referer: `${FANDANGO_ORIGIN}/`,
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Fandango showtimes request failed (${response.status})`);
  }

  const data = (await response.json()) as FandangoTheatersResponse;
  return data.theaters ?? [];
}

function extractShowtimes(
  theater: FandangoTheater,
  movie: FandangoMovie,
  movieTitle: string,
): ShowtimeSlot[] {
  const slots: ShowtimeSlot[] = [];
  const seen = new Set<string>();

  for (const variant of movie.variants ?? []) {
    for (const group of variant.amenityGroups ?? []) {
      for (const showtime of group.showtimes ?? []) {
        if (!showtime.ticketingJumpPageURL || !showtime.showtimeHashCode) continue;
        if (seen.has(showtime.showtimeHashCode)) continue;
        seen.add(showtime.showtimeHashCode);

        const formats = showtime.filmFormat?.map((f) => f.filterName).filter(Boolean) ?? [];

        slots.push({
          id: showtime.showtimeHashCode,
          time: showtime.date ?? showtime.screenReaderTime ?? "TBA",
          screenReaderTime: showtime.screenReaderTime ?? showtime.date ?? "",
          format: formats.length > 0 ? formats.join(" · ") : undefined,
          soldOut: showtime.type === "soldout",
          ticketUrl: showtime.ticketingJumpPageURL,
          ticketProvider: "Fandango",
        });
      }
    }
  }

  return slots.sort((a, b) => a.screenReaderTime.localeCompare(b.screenReaderTime));
}

function toTheaterShowtimes(
  theater: FandangoTheater,
  movie: FandangoMovie,
  movieTitle: string,
): TheaterShowtimes | null {
  const showtimes = extractShowtimes(theater, movie, movieTitle);
  if (showtimes.length === 0 || !theater.id || !theater.name) return null;

  return {
    id: String(theater.id),
    name: theater.name,
    chainCode: theater.chainCode,
    chainName: theater.chainName,
    address: theater.address1 ?? "",
    cityStateZip: theater.cityStateZip ?? "",
    distanceMiles: Math.round((theater.distance ?? 0) * 10) / 10,
    showtimes,
  };
}

export async function getNearbyShowtimes(
  zip: string,
  movieTitle: string,
  date = new Date().toISOString().split("T")[0],
): Promise<NearbyShowtimesResult> {
  const cookies = await getFandangoCookies();
  const theaters: TheaterShowtimes[] = [];
  const maxPages = 3;

  for (let page = 1; page <= maxPages; page += 1) {
    const pageTheaters = await fetchTheatersPage(zip, date, page, cookies);
    if (pageTheaters.length === 0) break;

    for (const theater of pageTheaters) {
      const match = theater.movies?.find((movie) =>
        movie.title ? movieTitlesMatch(movieTitle, movie.title) : false,
      );
      if (!match) continue;

      const parsed = toTheaterShowtimes(theater, match, movieTitle);
      if (parsed) theaters.push(parsed);
    }

    if (pageTheaters.length < 25) break;
  }

  theaters.sort((a, b) => a.distanceMiles - b.distanceMiles);

  return {
    theaters,
    date,
    zip,
    movieTitle,
  };
}
