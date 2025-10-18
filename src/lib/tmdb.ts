import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// const key = import.meta.env.TMDB_API;
const key =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzhmNWFhYzMxYmUyODc4NzFjNTI0NTRiNzUwODBmMSIsIm5iZiI6MTc1NTAyMjA0OC44NTQsInN1YiI6IjY4OWI4MmUwNzRlMjQwYzNiYTZkNzc0OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y2tNkT0Lejmb-Um3Gt6L7fwOEn1d6hary_KnukGmLOM";

interface MoviesParams {
  page?: number;
  query?: string;
}

const getMovies = async ({ page = 1, query = "" }: MoviesParams) => {
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
  return res.data.results;
};

export const useGetMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies({}),
  });
};

export const useGetMoviesById = (
  movieId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId && options?.enabled, // Only run query if movieId exists
  });
};
const getMovieById = async (movieId: string) => {
  const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
    params: {
      language: "en-US",
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${key}`,
    },
  });
  return res.data;
};
