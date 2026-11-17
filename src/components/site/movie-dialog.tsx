import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { Check, Play, Plus, Star, X } from "lucide-react";

import { img, useMovie, type Movie } from "@/lib/tmdb";
import { rating, runtime, year } from "@/lib/format";
import { useMyList, type SavedMovie } from "@/lib/my-list";

type Preview = Pick<Movie, "id" | "title" | "backdrop_path" | "poster_path"> &
  Partial<Pick<Movie, "release_date" | "vote_average" | "vote_count" | "overview">>;

const MovieDialogContext = createContext<{ open: (movie: Preview) => void } | null>(
  null
);

export function useMovieDialog() {
  const ctx = useContext(MovieDialogContext);
  if (!ctx) throw new Error("useMovieDialog must be used inside MovieDialogProvider");
  return ctx;
}

/** One dialog for the whole app, instead of one per poster card. */
export function MovieDialogProvider({ children }: { children: React.ReactNode }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((movie: Preview) => {
    setPreview(movie);
    setIsOpen(true);
  }, []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <MovieDialogContext.Provider value={value}>
      {children}
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-2xl bg-seat shadow-2xl outline-none duration-300 ease-[var(--ease-drawer)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[min(52rem,calc(100vw-4rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:duration-200 sm:ease-[var(--ease-out)] sm:data-[state=closed]:zoom-out-[0.96] sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:zoom-in-[0.96] sm:data-[state=open]:slide-in-from-bottom-0"
            aria-describedby={undefined}
          >
            {preview && <DialogBody preview={preview} onNavigate={() => setIsOpen(false)} />}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </MovieDialogContext.Provider>
  );
}

function DialogBody({
  preview,
  onNavigate,
}: {
  preview: Preview;
  onNavigate: () => void;
}) {
  const { data: movie, isError } = useMovie(preview.id);
  const { has, toggle } = useMyList();

  const title = movie?.title ?? preview.title;
  const backdrop = movie?.backdrop_path ?? preview.backdrop_path;
  const overview = movie?.overview ?? preview.overview;
  const score = rating(movie?.vote_average ?? preview.vote_average, movie?.vote_count ?? preview.vote_count);
  const director = movie?.credits?.crew.find((c) => c.job === "Director")?.name;
  const cast = movie?.credits?.cast.slice(0, 5).map((c) => c.name);
  const saved = has(preview.id);

  return (
    <>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-curtain sm:aspect-[2.2/1]">
        {backdrop && (
          <img
            src={img(backdrop, "w1280")}
            alt=""
            className="absolute inset-0 size-full object-cover animate-fade"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-seat via-seat/30 to-transparent" />
        <DialogPrimitive.Close className="icon-btn absolute top-3 right-3 bg-velvet/60 backdrop-blur-md">
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>

      <div className="relative -mt-16 px-5 pb-7 sm:-mt-20 sm:px-9 sm:pb-9">
        <DialogPrimitive.Title className="font-display text-3xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl">
          {title}
        </DialogPrimitive.Title>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dim">
          {score && (
            <span className="inline-flex items-center gap-1 font-semibold text-lamp">
              <Star className="size-3.5 fill-current" />
              {score}
            </span>
          )}
          {year(movie?.release_date ?? preview.release_date) && (
            <span>{year(movie?.release_date ?? preview.release_date)}</span>
          )}
          {movie?.runtime ? <span>{runtime(movie.runtime)}</span> : null}
          {movie?.genres?.length ? (
            <span>{movie.genres.map((g) => g.name).join(", ")}</span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/movie/$id"
            params={{ id: String(preview.id) }}
            search={{ play: true }}
            onClick={onNavigate}
            className="btn btn-primary"
          >
            <Play className="size-4 fill-current" />
            Play
          </Link>
          <button
            type="button"
            onClick={() =>
              toggle({
                id: preview.id,
                title,
                poster_path: movie?.poster_path ?? preview.poster_path,
                backdrop_path: backdrop,
                release_date: movie?.release_date ?? preview.release_date ?? "",
                vote_average: movie?.vote_average ?? preview.vote_average ?? 0,
                vote_count: movie?.vote_count ?? preview.vote_count ?? 0,
              } satisfies SavedMovie)
            }
            className="btn btn-ghost"
            aria-pressed={saved}
          >
            {saved ? <Check className="size-4" /> : <Plus className="size-4" />}
            {saved ? "In my list" : "Add to my list"}
          </button>
          <Link
            to="/movie/$id"
            params={{ id: String(preview.id) }}
            onClick={onNavigate}
            className="btn px-4 text-dim can-hover:hover:text-screen"
          >
            Full details
          </Link>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_14rem]">
          <p className="max-w-[62ch] text-[15px] leading-relaxed text-screen/90">
            {overview || (isError ? "Couldn't load this film's details. Check your connection and open it again." : "")}
          </p>
          {(director || cast?.length) && (
            <dl className="space-y-3 text-sm">
              {director && (
                <div>
                  <dt className="text-faint">Director</dt>
                  <dd className="text-screen">{director}</dd>
                </div>
              )}
              {cast?.length ? (
                <div>
                  <dt className="text-faint">Starring</dt>
                  <dd className="text-screen">{cast.join(", ")}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </div>
      </div>
    </>
  );
}
