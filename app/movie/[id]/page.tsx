import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieDetailsView } from "@/components/movie/MovieDetails";
import { getMovieDetails, getMovieExtras, isMovieInTheaters, isValidMovieId, TMDbError } from "@/lib/tmdb";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (!isValidMovieId(movieId)) {
    return { title: "Movie Not Found" };
  }

  try {
    const movie = await getMovieDetails(movieId);
    return {
      title: movie.title,
      description: movie.overview,
      openGraph: {
        title: movie.title,
        description: movie.overview,
      },
    };
  } catch {
    return { title: "Movie Not Found" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (!isValidMovieId(movieId)) {
    notFound();
  }

  try {
    const movie = await getMovieDetails(movieId);
    const [extras, isInTheaters] = await Promise.all([
      getMovieExtras(movie),
      isMovieInTheaters(movieId),
    ]);
    return <MovieDetailsView movie={movie} extras={extras} isInTheaters={isInTheaters} />;
  } catch (error) {
    if (error instanceof TMDbError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
