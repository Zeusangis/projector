import Banner from "@/components/components/movie-banner";
import { useInfiniteMovies, type Movie } from "@/lib/infiniteMovies";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movies")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: movies } = useInfiniteMovies();
  console.log(movies?.pages.flatMap((page) => page.results));
  return (
    <div className="bg-neutral-900 min-h-screen">
      <div className="h-screen">
        <Banner />
      </div>
      <div className="container mx-auto px-4 py-10 -mt-60 z-50 relative w-full">
        <div className="text-white text-start text-4xl font-bold py-5">
          Most Popular Movies
        </div>
        <div className="grid grid-cols-5 gap-5 ">
          {(movies?.pages.flatMap((page) => page.results) || []).map(
            (movie: Movie) => (
              <div key={movie.id} className="">
                <img
                  className="w-full rounded-lg bg-cover"
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  alt={movie.original_title}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
