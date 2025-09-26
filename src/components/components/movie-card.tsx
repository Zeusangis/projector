import { useState } from "react";
import type { Movie } from "./showMovies";
import { Button } from "../ui/button";

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
      className="relative text-center cursor-pointer hover:scale-105 transition-transform duration-300"
      ref={isLast ? lastMovieRef : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        className="w-full rounded-lg bg-cover"
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt={movie.original_title}
      />
      <div
        className={`${hovered ? "" : "hidden"} absolute bottom-0 w-full z-64 text-center text-white text-lg font-semibold py-2 bg-white/30 backdrop-blur-md rounded-b-lg`}
      >
        <span className="block">{movie.original_title}</span>
        <div className="px-4">
          <Button className="w-full bg-white h-10 hover:bg-gray-200 cursor-pointer text-black">
            Watch Now
          </Button>
        </div>
      </div>
    </div>
  );
}
