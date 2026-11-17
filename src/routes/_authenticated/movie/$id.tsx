import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Film, Play, Plus, Star } from "lucide-react";

import { backdropSrcSet, img, movieQuery, posterSrcSet } from "@/lib/tmdb";
import { rating, runtime, year } from "@/lib/format";
import { useMyList } from "@/lib/my-list";
import { Rail } from "@/components/site/rail";

export const Route = createFileRoute("/_authenticated/movie/$id")({
  validateSearch: (search: Record<string, unknown>): { play?: boolean } => ({
    play: search.play === true || search.play === "true" ? true : undefined,
  }),
  loader: async ({ params, context }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) throw notFound();
    await context.queryClient.ensureQueryData(movieQuery(id));
  },
  pendingComponent: MoviePending,
  pendingMs: 150,
  errorComponent: MovieError,
  notFoundComponent: MovieError,
  component: MoviePage,
});

function MoviePage() {
  const { id } = Route.useParams();
  const { play } = Route.useSearch();
  const { data: movie } = useSuspenseQuery(movieQuery(Number(id)));
  const { has, toggle } = useMyList();
  const saved = has(movie.id);

  const director = movie.credits?.crew.find((c) => c.job === "Director")?.name;
  const cast = movie.credits?.cast.slice(0, 12) ?? [];
  const similar = movie.similar?.results.filter((m) => m.poster_path) ?? [];
  const score = rating(movie.vote_average, movie.vote_count);

  return (
    <article>
      <div
        className={
          "relative isolate overflow-hidden " +
          // No backdrop: no tall empty frame, just room for the header.
          (movie.backdrop_path
            ? "h-[min(72svh,46rem)] min-h-[26rem]"
            : "h-[22rem] sm:h-[26rem]")
        }
      >
        {movie.backdrop_path && (
          <img
            src={img(movie.backdrop_path, "w1280")}
            srcSet={backdropSrcSet(movie.backdrop_path)}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 -z-10 size-full animate-fade object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-velvet via-velvet/50 to-velvet/20" />
      </div>

      <div className="relative -mt-56 grid gap-8 px-[var(--gutter)] sm:-mt-64 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="hidden animate-lift md:block">
          {movie.poster_path ? (
            <img
              src={img(movie.poster_path, "w342")}
              srcSet={posterSrcSet(movie.poster_path)}
              sizes="18rem"
              alt={`${movie.title} poster`}
              className="aspect-[2/3] w-full rounded-xl object-cover shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full flex-col justify-between rounded-xl bg-curtain p-5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]">
              <Film className="size-6 text-faint" aria-hidden />
              <span className="line-clamp-6 font-display text-2xl leading-tight font-bold text-dim [overflow-wrap:anywhere]">
                {movie.title}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 animate-lift self-end [animation-delay:40ms]">
          <h1
            className={
              "font-display leading-[0.92] font-extrabold tracking-[-0.035em] [overflow-wrap:anywhere] " +
              (movie.title.length > 32
                ? "text-[clamp(2rem,5vw,4.25rem)]"
                : "text-[clamp(2.5rem,6.5vw,5.5rem)]")
            }
          >
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="mt-3 text-lg text-dim">{movie.tagline}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dim">
            {score && (
              <span className="inline-flex items-center gap-1 font-semibold text-lamp">
                <Star className="size-3.5 fill-current" />
                {score}
                <span className="font-normal text-faint">
                  ({movie.vote_count.toLocaleString()} votes)
                </span>
              </span>
            )}
            {year(movie.release_date) && (
              <span>{year(movie.release_date)}</span>
            )}
            {movie.runtime ? <span>{runtime(movie.runtime)}</span> : null}
          </div>
          {movie.genres.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <li key={g.id}>
                  <Link
                    to="/movies"
                    search={{ genre: g.id }}
                    className="block rounded-full px-3.5 py-1.5 text-sm text-dim shadow-[inset_0_0_0_1px_rgb(243_236_228/0.14)] transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] can-hover:hover:bg-screen/[0.06] can-hover:hover:text-screen"
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/movie/$id"
              params={{ id }}
              search={{ play: true }}
              replace
              resetScroll={false}
              className="btn btn-primary"
            >
              <Play className="size-4 fill-current" />
              Play
            </Link>
            <button
              type="button"
              onClick={() => toggle(movie)}
              aria-pressed={saved}
              className="btn btn-ghost"
            >
              {saved ? (
                <Check className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              {saved ? "In my list" : "Add to my list"}
            </button>
          </div>
          <p className="mt-8 max-w-[65ch] text-[17px] leading-relaxed text-screen/90">
            {movie.overview}
          </p>
          {director && (
            <p className="mt-5 text-sm text-dim">
              Directed by <span className="text-screen">{director}</span>
            </p>
          )}
        </div>
      </div>

      <Player
        key={movie.id}
        id={movie.id}
        title={movie.title}
        backdrop={movie.backdrop_path}
        play={!!play}
      />

      {cast.length > 0 && (
        <section className="mt-16" aria-label="Cast">
          <h2 className="px-[var(--gutter)] font-display text-xl font-bold tracking-tight sm:text-2xl">
            Cast
          </h2>
          <ul className="rail mt-5 flex gap-4 overflow-x-auto px-[var(--gutter)] pb-2">
            {cast.map((c) => (
              <li key={c.id} className="w-24 shrink-0 sm:w-28">
                <div className="aspect-square overflow-hidden rounded-full bg-curtain">
                  {c.profile_path ? (
                    <img
                      src={img(c.profile_path, "w185")}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="grid size-full place-items-center font-display text-2xl font-bold text-faint">
                      {c.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 line-clamp-2 text-sm leading-tight font-medium [overflow-wrap:anywhere]">
                  {c.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-tight text-faint [overflow-wrap:anywhere]">
                  {c.character}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {similar.length > 0 && (
        <div className="mt-8">
          <Rail title="If you liked this" movies={similar} />
        </div>
      )}
    </article>
  );
}

/**
 * The player only loads when asked for, so opening a film page doesn't start a
 * third-party embed in the background. `?play=true` (from any Play button)
 * starts it and brings it into view.
 */
function Player({
  id,
  title,
  backdrop,
  play,
}: {
  id: number;
  title: string;
  backdrop: string | null;
  play: boolean;
}) {
  const [clicked, setClicked] = useState(false);
  const on = play || clicked;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!play) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    ref.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
  }, [play]);

  return (
    <section
      id="player"
      ref={ref}
      className="mt-16 scroll-mt-24 px-[var(--gutter)]"
      aria-label={`Watch ${title}`}
    >
      <div className="relative mx-auto aspect-video max-w-6xl overflow-hidden rounded-2xl bg-black shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-screen/10">
        {on ? (
          <iframe
            src={`https://vidsrc.mov/embed/movie/${id}`}
            title={`${title} player`}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="origin"
            className="size-full animate-fade"
          />
        ) : (
          <button
            type="button"
            onClick={() => setClicked(true)}
            className="group absolute inset-0 grid place-items-center"
          >
            {backdrop && (
              <img
                src={img(backdrop, "w780")}
                srcSet={backdropSrcSet(backdrop)}
                sizes="(min-width: 1152px) 72rem, 100vw"
                alt=""
                decoding="async"
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-50 transition-opacity duration-300 can-hover:group-hover:opacity-65"
              />
            )}
            <span className="relative grid size-20 place-items-center rounded-full bg-screen text-velvet shadow-2xl transition-transform duration-200 ease-[var(--ease-out)] group-active:scale-95 can-hover:group-hover:scale-105">
              <Play className="ml-1 size-8 fill-current" />
            </span>
            <span className="sr-only">Play {title}</span>
          </button>
        )}
      </div>
    </section>
  );
}

function MoviePending() {
  return (
    <div className="grid h-[72svh] place-items-center">
      <div className="beam" />
    </div>
  );
}

function MovieError() {
  return (
    <div className="px-[var(--gutter)] pt-36">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        We couldn't find that film.
      </h1>
      <p className="mt-4 max-w-md text-lg text-dim">
        The link may be wrong, or TMDB isn't responding. Search for it, or go
        back to the home page.
      </p>
      <Link to="/" className="btn btn-primary mt-8">
        Back to home
      </Link>
    </div>
  );
}
