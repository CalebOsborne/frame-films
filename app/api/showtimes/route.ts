import { NextRequest, NextResponse } from "next/server";
import { getNearbyShowtimes } from "@/lib/fandangoShowtimes";

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip")?.trim() ?? "";
  const title = request.nextUrl.searchParams.get("title")?.trim() ?? "";
  const date = request.nextUrl.searchParams.get("date")?.trim();

  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "A valid 5-digit US zip code is required" }, { status: 400 });
  }

  if (title.length < 1) {
    return NextResponse.json({ error: "Movie title is required" }, { status: 400 });
  }

  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date must be YYYY-MM-DD" }, { status: 400 });
  }

  try {
    const result = await getNearbyShowtimes(zip, title, date || undefined);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to load nearby showtimes" }, { status: 502 });
  }
}
