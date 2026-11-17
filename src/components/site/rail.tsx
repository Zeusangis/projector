import { useCallback, useEffect, useRef, useState } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Poster, PosterSkeleton } from "./poster";

type RailMovie = React.ComponentProps<typeof Poster>["movie"];

/**
 * A titled, horizontally scrolling row. Native scroll with snap points, so
 * trackpads, touch and keyboard all work; arrow buttons appear only where a
 * pointer can hover.
 */
export function Rail({
  title,
  movies,
  isLoading,
  ranked = false,
  more,
}: {
  title: string;
  movies: RailMovie[] | undefined;
  isLoading?: boolean;
  ranked?: boolean;
  more?: { label: string; link: LinkProps };
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
    // Scroll fires every frame; only re-render the row when an edge actually changes.
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, movies]);

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!isLoading && (!movies || movies.length === 0)) return null;

  return (
    <section className="group/rail relative py-5 sm:py-7" aria-label={title}>
      <div className="mb-4 flex items-end justify-between gap-4 px-[var(--gutter)]">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {more && (
          <Link
            {...more.link}
            className="relative shrink-0 text-sm text-dim can-hover:hover:text-screen after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-[var(--ease-out)] can-hover:hover:after:scale-x-100"
          >
            {more.label}
          </Link>
        )}
      </div>

      <div className="relative">
        <div
          ref={scroller}
          onScroll={measure}
          className="rail flex gap-3 overflow-x-auto px-[var(--gutter)] pb-2 sm:gap-4"
        >
          {isLoading || !movies
            ? Array.from({ length: 8 }, (_, i) => (
                <PosterSkeleton
                  key={i}
                  className={cn("shrink-0", ranked ? "w-[52vw] sm:w-[14rem] xl:w-[16rem]" : "w-[36vw] sm:w-[11rem] xl:w-[12.5rem]")}
                />
              ))
            : movies.map((movie, i) =>
                ranked ? (
                  <Poster
                    key={movie.id}
                    movie={movie}
                    rank={i + 1}
                    sizes="(min-width: 1280px) 150px, (min-width: 640px) 130px, 30vw"
                    className="w-[52vw] shrink-0 sm:w-[14rem] xl:w-[16rem]"
                  />
                ) : (
                  <Poster
                    key={movie.id}
                    movie={movie}
                    sizes="(min-width: 1280px) 200px, (min-width: 640px) 176px, 36vw"
                    className="w-[36vw] shrink-0 sm:w-[11rem] xl:w-[12.5rem]"
                  />
                )
              )}
        </div>

        <RailArrow side="left" hidden={edges.start} onClick={() => page(-1)} />
        <RailArrow side="right" hidden={edges.end} onClick={() => page(1)} />
      </div>
    </section>
  );
}

function RailArrow({
  side,
  hidden,
  onClick,
}: {
  side: "left" | "right";
  hidden: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={onClick}
      className={cn(
        "absolute top-0 bottom-12 z-10 hidden w-[var(--gutter)] min-w-12 items-center justify-center from-velvet via-velvet/80 to-transparent opacity-0 transition-opacity duration-200 can-hover:flex can-hover:group-hover/rail:opacity-100",
        side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
        hidden && "pointer-events-none !opacity-0"
      )}
    >
      <span className="icon-btn bg-curtain/90 shadow-lg">
        <Icon className="size-5" />
      </span>
    </button>
  );
}

