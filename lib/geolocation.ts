import type { TicketLocation } from "@/types/tickets";

type NominatimResponse = {
  address?: {
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    "ISO3166-2-lvl4"?: string;
  };
};

function formatLocationLabel(city: string | undefined, state: string | undefined, zip: string): string {
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  return zip;
}

/** Reverse geocode coordinates to a US zip and city label via OpenStreetMap Nominatim. */
export async function reverseGeocode(latitude: number, longitude: number): Promise<TicketLocation | null> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
    addressdetails: "1",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
    headers: {
      "User-Agent": "Frame/1.0 (local movie discovery; contact: local-dev)",
      Accept: "application/json",
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) return null;

  const data = (await response.json()) as NominatimResponse;
  const postcode = data.address?.postcode?.split(" ")[0]?.trim();
  if (!postcode || !/^\d{5}$/.test(postcode)) return null;

  const city = data.address?.city ?? data.address?.town ?? data.address?.village;
  const state = data.address?.state;

  return {
    zip: postcode,
    city,
    state,
    latitude,
    longitude,
    label: formatLocationLabel(city, state, postcode),
  };
}

/** Build a location from a manually entered US zip code. */
export function locationFromZip(zip: string, latitude = 0, longitude = 0): TicketLocation {
  const cleaned = zip.trim().slice(0, 5);
  return {
    zip: cleaned,
    latitude,
    longitude,
    label: cleaned,
  };
}
