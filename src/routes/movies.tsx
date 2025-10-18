import Banner from "@/components/components/movie-banner";
import { MovieCard } from "@/components/components/movie-card";
import Navbar from "@/components/components/navbar";
import { useInfiniteMovies, type Movie } from "@/lib/infiniteMovies";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef } from "react";

export const Route = createFileRoute("/movies")({
  component: RouteComponent,
});

function RouteComponent() {
  const observer = useRef<IntersectionObserver | null>(null);
  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMovies();

  const lastMovieRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            fetchNextPage();
          }, 500);
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  return (
    <div className="bg-neutral-900 min-h-screen">
      <Navbar />
      <div className="h-screen">
        <Banner />
      </div>
      <div className="container mx-auto px-4 py-10 -mt-60 z-50 relative w-full">
        <div className="text-white text-start text-4xl font-bold py-5">
          Most Popular Movies
        </div>
        <div className="grid grid-cols-5 gap-5 ">
          {(movies?.pages.flatMap((page) => page.results) || []).map(
            (movie: Movie, idx: number, arr: Movie[]) => {
              const isLast = idx === arr.length - 1;
              return (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isLast={isLast}
                  lastMovieRef={isLast ? lastMovieRef : undefined}
                />
              );
            }
          )}
        </div>
      </div>
      <div className="loader flex justify-center items-center mx-auto my-10"></div>
    </div>
  );
}
