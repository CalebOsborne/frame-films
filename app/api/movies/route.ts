import { NextRequest, NextResponse } from "next/server";
import { getMoviesByIds, isValidMovieId } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  const ids = idsParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter(isValidMovieId)
    .slice(0, 20);

  if (ids.length === 0) {
    return NextResponse.json({ movies: [] });
  }

  try {
    const movies = await getMoviesByIds(ids);
    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
