import { useGetRandomMovie } from "@/lib/getRandomMovie";

import ReusableBanner from "./reusableBanner";

function MovieBanner() {
  const { data: movie, isLoading } = useGetRandomMovie();

  if (isLoading) return <div className="loader"></div>;
  if (!movie) return null;

  return (
    <>
      <ReusableBanner
        backgroundImageUrl={movie.backdrop_path || movie.poster_path}
        title={movie.original_title}
        overview={movie.overview}
        onWatchNowClick={() => console.log("Watch Now clicked")}
        onDetailsClick={() => console.log("Details clicked")}
      />
    </>
  );
}

export default MovieBanner;
