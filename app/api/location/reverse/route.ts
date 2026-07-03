import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/geolocation";

export async function GET(request: NextRequest) {
  const lat = parseFloat(request.nextUrl.searchParams.get("lat") ?? "");
  const lon = parseFloat(request.nextUrl.searchParams.get("lon") ?? "");

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Coordinates out of range" }, { status: 400 });
  }

  try {
    const location = await reverseGeocode(lat, lon);
    if (!location) {
      return NextResponse.json(
        { error: "Could not resolve a US zip code for this location" },
        { status: 404 },
      );
    }
    return NextResponse.json({ location });
  } catch {
    return NextResponse.json({ error: "Reverse geocoding failed" }, { status: 500 });
  }
}
