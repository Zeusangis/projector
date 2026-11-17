import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { img, movieQuery, posterSrcSet, type Movie } from "@/lib/tmdb";
import { rating, year } from "@/lib/format";
import { useMovieDialog } from "./movie-dialog";

type PosterMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "backdrop_path" | "release_date" | "vote_average" | "vote_count"
> &
  Partial<Pick<Movie, "overview">>;

export function Poster({
  movie,
  sizes = "(min-width: 1280px) 15vw, (min-width: 768px) 22vw, 40vw",
  eager = false,
  rank,
  className,
}: {
  movie: PosterMovie;
  sizes?: string;
  eager?: boolean;
  /** Position in a ranking (1 = most watched), drawn large beside the poster. */
  rank?: number;
  className?: string;
}) {
  const { open } = useMovieDialog();
  const queryClient = useQueryClient();
  const score = rating(movie.vote_average, movie.vote_count);

  // Start loading details the moment a pointer settles on the card.
  const prefetch = () => queryClient.prefetchQuery(movieQuery(movie.id));

  return (
    <button
      type="button"
      aria-label={rank !== undefined ? `${rank}. ${movie.title}` : undefined}
      onClick={() => open(movie)}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      className={cn("group block w-full text-left outline-none", className)}
    >
      <div className="flex items-end">
      {rank !== undefined && (
        <span
          aria-hidden
          className="-mr-[0.08em] w-[42%] shrink-0 text-right font-display text-[clamp(5rem,16vw,8.5rem)] leading-[0.74] font-extrabold tracking-[-0.07em] text-velvet [-webkit-text-stroke:1.5px_var(--color-faint)] [paint-order:stroke] transition-[-webkit-text-stroke-color] duration-300 can-hover:group-hover:[-webkit-text-stroke-color:var(--color-lamp)]"
        >
          {rank}
        </span>
      )}
      <div className="relative aspect-[2/3] min-w-0 flex-1 overflow-hidden rounded-lg bg-curtain shadow-[0_1px_0_rgb(243_236_228/0.06)_inset] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] group-focus-visible:ring-2 group-focus-visible:ring-lamp group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-velvet group-active:scale-[0.98] can-hover:group-hover:-translate-y-0.5 can-hover:group-hover:shadow-[0_18px_40px_-12px_rgb(0_0_0/0.7)]">
        {movie.poster_path ? (
          <img
            src={img(movie.poster_path, "w342")}
            srcSet={posterSrcSet(movie.poster_path)}
            sizes={sizes}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-[var(--ease-out)] can-hover:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-end p-3 font-display text-lg leading-tight font-bold text-dim">
            {movie.title}
          </div>
        )}
        {score && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-velvet/75 px-2 py-0.5 text-xs font-semibold text-lamp backdrop-blur-md">
            <Star className="size-3 fill-current" />
            {score}
          </span>
        )}
      </div>
      </div>
      <div className={cn("mt-2.5 px-0.5", rank !== undefined && "pl-[42%]")}>
        <p className="truncate text-sm font-medium text-screen/90 transition-colors duration-200 can-hover:group-hover:text-screen">
          {movie.title}
        </p>
        <p className="text-xs text-faint">{year(movie.release_date) || " "}</p>
      </div>
    </button>
  );
}

export function PosterSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)} aria-hidden>
      <div className="aspect-[2/3] animate-pulse rounded-lg bg-seat" />
      <div className="mt-2.5 h-3.5 w-3/4 animate-pulse rounded bg-seat" />
      <div className="mt-1.5 h-3 w-1/4 animate-pulse rounded bg-seat" />
    </div>
  );
}
