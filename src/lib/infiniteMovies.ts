import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export interface IResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
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
      limit: 18,
      include_adult: false,
      include_video: false,
      language: "en-US",
      sort_by: "popularity.desc",
    },
    headers: { accept: "application/json", Authorization: `Bearer ${key}` },
  });
  return res.data as IResponse;
};

export const useInfiniteMovies = () => {
  return useInfiniteQuery({
    queryKey: ["infinite-movies"],
    queryFn: ({ pageParam = 1 }) => getMovies({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
