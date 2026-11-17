import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

if (!token) {
  throw new Error(
    "Add VITE_TMDB_TOKEN (your TMDB API Read Access Token) to the .env file"
  );
}

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: { accept: "application/json", Authorization: `Bearer ${token}` },
  params: { language: "en-US" },
});

/* ---------- Types ---------- */

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface Page<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  original_language: string;
  credits?: { cast: CastMember[]; crew: { job: string; name: string }[] };
  similar?: Page<Movie>;
  videos?: { results: Video[] };
}

export interface Video {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

/** The official YouTube trailer, falling back to any trailer or teaser. */
export function trailerKey(videos: Video[] | undefined) {
  const yt = (videos ?? []).filter((v) => v.site === "YouTube");
  return (
    yt.find((v) => v.type === "Trailer" && v.official) ??
    yt.find((v) => v.type === "Trailer") ??
    yt.find((v) => v.type === "Teaser")
  )?.key;
}

export type MovieList = "popular" | "top_rated" | "now_playing" | "upcoming";

export type SortKey =
  | "popularity.desc"
  | "vote_average.desc"
  | "primary_release_date.desc";

/* ---------- Images ---------- */

type ImageSize = "w92" | "w185" | "w342" | "w500" | "w780" | "w1280";

export function img(path: string | null | undefined, size: ImageSize) {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : undefined;
}

/** srcSet for a poster so phones never download a desktop-size file. */
export function posterSrcSet(path: string | null | undefined) {
  if (!path) return undefined;
  return `${img(path, "w185")} 185w, ${img(path, "w342")} 342w, ${img(path, "w500")} 500w`;
}

/**
 * srcSet for a backdrop: 780 on phones, 1280 everywhere else. "original" can be
 * a 4K file of several megabytes, and behind gradients nobody sees the difference.
 */
export function backdropSrcSet(path: string | null | undefined) {
  if (!path) return undefined;
  return `${img(path, "w780")} 780w, ${img(path, "w1280")} 1280w`;
}

/* ---------- Pagination ---------- */

export function nextPageParam(
  lastPage: Pick<Page<unknown>, "page" | "total_pages">
) {
  // TMDB refuses pages past 500 even when total_pages is higher.
  const last = Math.min(lastPage.total_pages, 500);
  return lastPage.page < last ? lastPage.page + 1 : undefined;
}

/* ---------- Queries ---------- */

const STALE = 1000 * 60 * 5;

export const trendingQuery = queryOptions({
  queryKey: ["trending", "week"],
  queryFn: async () =>
    (await tmdb.get<Page<Movie>>("/trending/movie/week")).data.results,
  staleTime: STALE,
});

export const listQuery = (list: MovieList) =>
  queryOptions({
    queryKey: ["list", list],
    queryFn: async () =>
      (await tmdb.get<Page<Movie>>(`/movie/${list}`)).data.results,
    staleTime: STALE,
  });

export const genresQuery = queryOptions({
  queryKey: ["genres"],
  queryFn: async () =>
    (await tmdb.get<{ genres: Genre[] }>("/genre/movie/list")).data.genres,
  staleTime: Infinity,
});

export const movieQuery = (id: number) =>
  queryOptions({
    queryKey: ["movie", id],
    queryFn: async () =>
      (
        await tmdb.get<MovieDetails>(`/movie/${id}`, {
          params: { append_to_response: "credits,similar,videos" },
        })
      ).data,
    staleTime: STALE,
  });

export const discoverQuery = ({
  genre,
  sort,
}: {
  genre?: number;
  sort: SortKey;
}) =>
  infiniteQueryOptions({
    queryKey: ["discover", genre ?? "all", sort],
    queryFn: async ({ pageParam }) =>
      (
        await tmdb.get<Page<Movie>>("/discover/movie", {
          params: {
            page: pageParam,
            sort_by: sort,
            with_genres: genre,
            include_adult: false,
            include_video: false,
            // Without a floor, "top rated" fills up with films that have three votes.
            "vote_count.gte": sort === "vote_average.desc" ? 300 : undefined,
            "primary_release_date.lte":
              sort === "primary_release_date.desc"
                ? new Date().toISOString().slice(0, 10)
                : undefined,
          },
        })
      ).data,
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
    staleTime: STALE,
  });

export const searchQuery = (query: string) =>
  queryOptions({
    queryKey: ["search", query.trim()],
    queryFn: async ({ signal }) =>
      (
        await tmdb.get<Page<Movie>>("/search/movie", {
          params: { query: query.trim(), include_adult: false },
          signal,
        })
      ).data.results,
    enabled: query.trim().length > 1,
    staleTime: STALE,
    placeholderData: keepPreviousData,
  });

/* ---------- Hooks ---------- */

export const useTrending = () => useQuery(trendingQuery);
export const useMovieList = (list: MovieList) => useQuery(listQuery(list));
export const useGenres = () => useQuery(genresQuery);
export const useMovie = (id: number | null) =>
  useQuery({ ...movieQuery(id ?? 0), enabled: id !== null });
export const useDiscover = (args: { genre?: number; sort: SortKey }) =>
  useInfiniteQuery(discoverQuery(args));
export const useSearch = (query: string) => useQuery(searchQuery(query));
