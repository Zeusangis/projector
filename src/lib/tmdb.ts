import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const key = import.meta.env.TMDB_API;

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
