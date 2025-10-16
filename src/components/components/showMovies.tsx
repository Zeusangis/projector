import { useGetMovies } from "@/lib/tmdb";
import { MovieCard } from "./movie-card";

export interface Movie {
  id: number;
  original_title: string;
  poster_path: string;
}

function ShowMovies() {
  const { data: movies } = useGetMovies();

  return (
    <div className="-mt-60 z-50 relative w-full">
      <div className="text-white text-start text-4xl font-bold py-5">
        Trending Movies
      </div>
      <div className="grid w-full grid-cols-5 gap-5">
        {(movies || []).slice(0, 5).map((movie: Movie) => {
          return <MovieCard key={movie.id} movie={movie} isLast={false} />;
        })}
      </div>
    </div>
  );
}

export default ShowMovies;
