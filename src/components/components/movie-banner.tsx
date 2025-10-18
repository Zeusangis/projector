import { useGetRandomMovie } from "@/lib/getRandomMovie";

import ReusableBanner from "./reusableBanner";
// import { MovieDetailsDialog } from "./movie-details";

function MovieBanner() {
  const { data: movie, isLoading } = useGetRandomMovie();

  if (isLoading) return <div className="loader">Loading...</div>;
  if (!movie) return <div>No movie found</div>;

  return (
    <ReusableBanner
      movieId={movie.id}
      backgroundImageUrl={movie.backdrop_path || movie.poster_path}
      title={movie.original_title}
      overview={movie.overview}
      onWatchNowClick={() => console.log("Watch Now clicked")}
      onDetailsClick={() => console.log("Details clicked")}
    />
  );
}

export default MovieBanner;
