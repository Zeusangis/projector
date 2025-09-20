import { useGetRandomMovie } from "@/lib/getRandomMovie";
import { Button } from "../ui/button";
import { Play } from "lucide-react";

function Banner() {
  const { data: movie, isLoading } = useGetRandomMovie();
  console.log(movie);

  if (isLoading) return <div className="loader"></div>;
  if (!movie) return null;

  return (
    <>
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-[500px] md:h-[800px] z-0"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-[400px] md:h-[700px] max-w-lg flex items-center pb-8 px-4">
        <div className="flex flex-col text-start gap-4">
          <div className="text-white">
            <h1 className="text-2xl md:text-4xl font-bold">
              {movie.original_title}
            </h1>
            <p className="text-lg md:text-xl mt-2 opacity-90">
              {movie.overview?.slice(0, 180)}...
            </p>
          </div>
          <div className="space-x-5">
            <Button className="bg-white text-black cursor-pointer rounded-full hover:bg-gray-200 px-2">
              <span> Watch Now</span>
              <Play className="ml-2 h-4 w-4" />
            </Button>
            <Button className="px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer transition">
              Details
              <span className="text-lg">›</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Banner;
