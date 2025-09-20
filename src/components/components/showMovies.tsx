import { useGetMovies } from "@/lib/tmdb";

interface Movie {
  id: number;
  original_title: string;
  poster_path: string;
}

function ShowMovies() {
  const { data: movies } = useGetMovies();
  console.log(movies);
  return (
    <>
      <div className="text-white font-bold">Trending Movies</div>
      <div className="flex justify-center items-center w-full grid-cols-6 space-x-8 my-10">
        {(movies || []).slice(0, 6).map((movie: Movie) => (
          <div key={movie.id} className="flex justify-center">
            <div className="hover:opacity-50 transition duration-300 cursor-pointer">
              <img
                className="w-[100px] md:w-[190px] rounded-lg bg-cover"
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.original_title}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ShowMovies;
