import { useGetMovies } from "@/lib/tmdb";

interface Movie {
  id: number;
  original_title: string;
  poster_path: string;
}

function ShowMovies() {
  const { data: movies } = useGetMovies();
  return (
    <div className="my-10 w-full">
      <div className="text-white text-start text-2xl font-bold py-5">
        Trending Movies
      </div>
      <div className="grid w-full grid-cols-6 gap-6">
        {(movies || []).slice(0, 6).map((movie: Movie) => (
          <div key={movie.id} className="">
            <img
              className="w-[100px] md:w-[190px] rounded-lg bg-cover"
              src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              alt={movie.original_title}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowMovies;
