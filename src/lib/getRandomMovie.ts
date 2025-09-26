import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// const key = import.meta.env.TMDB_API;
const key =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzhmNWFhYzMxYmUyODc4NzFjNTI0NTRiNzUwODBmMSIsIm5iZiI6MTc1NTAyMjA0OC44NTQsInN1YiI6IjY4OWI4MmUwNzRlMjQwYzNiYTZkNzc0OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y2tNkT0Lejmb-Um3Gt6L7fwOEn1d6hary_KnukGmLOM";

interface MoviesParams {
  page?: number;
  query?: string;
}

const getRandomMovie = async ({ page = 1, query = "" }: MoviesParams) => {
  const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
    params: {
      page,
      query,
      include_adult: false,
      include_video: false,
      language: "en-US",
      sort_by: "popularity.desc",
    },
    headers: { accept: "application/json", Authorization: `Bearer ${key}` },
  });

  const movies = res.data.results;
  const movie = movies[Math.floor(Math.random() * movies.length)];
  return movie;
};

export const useGetRandomMovie = () => {
  return useQuery({
    queryKey: ["randomMovie"],
    queryFn: () => getRandomMovie({}),
  });
};
