import { useGetRandomMovie } from "@/lib/getRandomMovie";

import ReusableBanner from "./reusableBanner";

function MovieBanner() {
  const { data: movie, isLoading } = useGetRandomMovie();

  const handleOnDetailsClick = () => {
    if (movie) {
      // Navigate to the movie details page using the movie ID
      window.location.href = `/movie/${movie.id}`;
    }
  };

  if (isLoading) return <div className="loader">Loading...</div>;
  if (!movie) return <div>No movie found</div>;

  return (
    <ReusableBanner
      backgroundImageUrl={movie.backdrop_path || movie.poster_path}
      title={movie.original_title}
      overview={movie.overview}
      onWatchNowClick={() => console.log("Watch Now clicked")}
      onDetailsClick={handleOnDetailsClick}
    />
  );
}

export default MovieBanner;
