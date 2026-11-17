import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Info, Play, Plus, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { backdropSrcSet, img, useGenres, type Movie } from "@/lib/tmdb";
import { rating, year } from "@/lib/format";
import { useMyList } from "@/lib/my-list";
import { useMovieDialog } from "./movie-dialog";

const SLIDE_MS = 9000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/**
 * The featured film, shown the way a projector starts: the frame opens from a
 * thin slit of light, then the title settles. Rotates through this week's
 * trending films; hovering or focusing the hero pauses it.
 */
export function Hero({ movies, isLoading }: { movies: Movie[] | undefined; isLoading: boolean }) {
  const slides = useMemo(
    () => (movies ?? []).filter((m) => m.backdrop_path).slice(0, 6),
    [movies]
  );
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const paused = hovered || hidden;
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { data: genres } = useGenres();
  const { open } = useMovieDialog();
  const { has, toggle } = useMyList();

  const go = (next: number) => {
    if (next === index) return;
    setPrevious(index);
    setIndex(next);
  };

  // A film keeps its place while the tab is in the background.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Warm the cache for the next backdrop so the shutter never opens on nothing.
  useEffect(() => {
    const next = slides[(index + 1) % slides.length];
    if (next) {
      const pre = new Image();
      pre.srcset = backdropSrcSet(next.backdrop_path) ?? "";
      pre.sizes = "100vw";
    }
  }, [index, slides]);

  if (isLoading || slides.length === 0) {
    return (
      <div className="relative flex h-[min(88svh,52rem)] min-h-[34rem] items-end bg-seat px-[var(--gutter)] pb-28">
        <div className="beam" />
      </div>
    );
  }

  const movie = slides[index];
  const prev = previous !== null ? slides[previous] : null;
  const genreNames = movie.genre_ids
    .map((id) => genres?.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3);
  const score = rating(movie.vote_average, movie.vote_count);
  const saved = has(movie.id);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured this week"
      className="relative isolate h-[min(88svh,52rem)] min-h-[34rem] overflow-hidden bg-black"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
      }}
      // Swipe between films on touch. A quick flick counts even if it is short.
      onTouchStart={(e) => {
        const t = e.touches[0];
        swipe.current = { x: t.clientX, y: t.clientY, t: performance.now() };
      }}
      onTouchEnd={(e) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) < Math.abs(dy) * 1.5) return; // vertical scroll, not a swipe
        const velocity = Math.abs(dx) / (performance.now() - start.t);
        if (Math.abs(dx) > 60 || velocity > 0.4) {
          go((index + (dx < 0 ? 1 : -1) + slides.length) % slides.length);
        }
      }}
    >
      {/* Previous frame stays underneath while the new one opens over it. */}
      {prev && (
        <img
          key={`prev-${prev.id}`}
          src={img(prev.backdrop_path, "w1280")}
          srcSet={backdropSrcSet(prev.backdrop_path)}
          sizes="100vw"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover"
        />
      )}
      {/* The frame settles slowly while the film is on screen, in step with the reel bar. */}
      <div
        key={movie.id}
        className={cn("absolute inset-0 -z-10", !reducedMotion && "animate-settle")}
        style={{
          animationDuration: `${SLIDE_MS}ms`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <img
          src={img(movie.backdrop_path, "w1280")}
          srcSet={backdropSrcSet(movie.backdrop_path)}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="size-full animate-shutter object-cover"
        />
      </div>

      {/* Legibility: the room darkens toward the seats and toward the text. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-velvet via-velvet/40 to-velvet/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-velvet/90 via-velvet/40 to-transparent sm:via-velvet/30" />

      <div
        key={`copy-${movie.id}`}
        className="flex h-full flex-col justify-end px-[var(--gutter)] pb-32 sm:pb-36"
      >
        <div className="max-w-2xl">
          <h1
            className="animate-rise font-display text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.92] font-extrabold tracking-[-0.035em] [animation-delay:380ms]"
          >
            {movie.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-dim animate-rise [animation-delay:470ms]">
            {score && (
              <span className="inline-flex items-center gap-1 font-semibold text-lamp">
                <Star className="size-3.5 fill-current" />
                {score}
              </span>
            )}
            <span>{year(movie.release_date)}</span>
            {genreNames.length > 0 && <span>{genreNames.join(", ")}</span>}
          </div>
          <p className="mt-4 line-clamp-3 max-w-[56ch] text-base leading-relaxed text-screen/85 animate-rise [animation-delay:540ms] sm:text-lg">
            {movie.overview}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 animate-rise [animation-delay:600ms]">
            <Link
              to="/movie/$id"
              params={{ id: String(movie.id) }}
              search={{ play: true }}
              className="btn btn-primary"
            >
              <Play className="size-4 fill-current" />
              Play
            </Link>
            <button type="button" onClick={() => open(movie)} className="btn btn-ghost">
              <Info className="size-4" />
              Details
            </button>
            <button
              type="button"
              onClick={() => toggle(movie)}
              aria-pressed={saved}
              aria-label={saved ? "Remove from my list" : "Add to my list"}
              className="btn btn-ghost w-12 px-0"
            >
              {saved ? <Check className="size-5" /> : <Plus className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide picker. The bar under the current film fills as its time runs. */}
      <div
        role="tablist"
        aria-label="Choose a featured film"
        onKeyDown={(e) => {
          const keys: Record<string, number> = {
            ArrowRight: (index + 1) % slides.length,
            ArrowLeft: (index - 1 + slides.length) % slides.length,
            Home: 0,
            End: slides.length - 1,
          };
          const next = keys[e.key];
          if (next === undefined) return;
          e.preventDefault();
          go(next);
          (e.currentTarget.children[next] as HTMLElement | undefined)?.focus();
        }}
        className="absolute inset-x-0 bottom-0 flex gap-2 px-[var(--gutter)] pb-8 sm:gap-3"
      >
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={s.title}
              tabIndex={active ? 0 : -1}
              onClick={() => go(i)}
              className="group/tab relative flex-1 py-3 text-left sm:max-w-44"
            >
              <span
                className={cn(
                  "hidden truncate pb-2 text-xs transition-colors duration-200 sm:block",
                  active ? "text-screen" : "text-faint can-hover:group-hover/tab:text-dim"
                )}
              >
                {s.title}
              </span>
              <span className="block h-[3px] overflow-hidden rounded-full bg-screen/15">
                {active && (
                  <span
                    key={`bar-${s.id}`}
                    onAnimationEnd={() => go((index + 1) % slides.length)}
                    className={cn(
                      "block h-full origin-left rounded-full bg-lamp",
                      reducedMotion ? "scale-x-100" : "animate-progress"
                    )}
                    style={{
                      animationDuration: `${SLIDE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
