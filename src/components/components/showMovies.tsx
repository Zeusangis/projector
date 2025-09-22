import { useGetMovies } from "@/lib/tmdb";

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
          return (
            <div key={movie.id} className="">
              <img
                className="w-full rounded-lg bg-cover"
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.original_title}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShowMovies;
