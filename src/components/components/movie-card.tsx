import { useState } from "react";
import type { Movie } from "./showMovies";
import { MovieDetailsDialog } from "./movie-details";

export function MovieCard({
  movie,
  isLast,
  lastMovieRef,
}: {
  movie: Movie;
  isLast: boolean;
  lastMovieRef?: (node: HTMLDivElement) => void;
}) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      key={movie.id}
      className="relative text-center rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 group "
      ref={isLast ? lastMovieRef : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className="w-full bg-cover group-hover:scale-105 z-40 transition-transform duration-300"
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt={movie.original_title}
      />

      <div
        className={`${hovered ? "" : "hidden"} absolute h-80 bottom-0 w-full z-64 text-center text-white text-lg font-semibold py-2 bg-gradient-to-t from-black to-transparent space-y-4 rounded-b-lg transition duration-300`}
      >
        <div className="h-full w-full flex items-center justify-end flex-col space-y-4 px-3">
          <span className="block">{movie.original_title}</span>
          <div className="w-full z-90">
            <MovieDetailsDialog movieId={movie.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
