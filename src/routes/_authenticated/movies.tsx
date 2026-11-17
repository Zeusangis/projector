import { useEffect, useMemo, useRef } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { useDiscover, useGenres, type SortKey } from "@/lib/tmdb";
import { Poster, PosterSkeleton } from "@/components/site/poster";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popularity.desc", label: "Popular" },
  { key: "vote_average.desc", label: "Top rated" },
  { key: "primary_release_date.desc", label: "Newest" },
];

type Search = { genre?: number; sort?: SortKey };

export const Route = createFileRoute("/_authenticated/movies")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const genre = Number(search.genre);
    const sort = SORTS.find((s) => s.key === search.sort)?.key;
    return {
      genre: Number.isInteger(genre) && genre > 0 ? genre : undefined,
      sort: sort && sort !== "popularity.desc" ? sort : undefined,
    };
  },
  component: Browse,
});

function Browse() {
  const { genre, sort = "popularity.desc" } = Route.useSearch();
  const { data: genres } = useGenres();
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscover({ genre, sort });

  // Load the next page while the reader is still ~2 screens away from the end.
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasNextPage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "1200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Different pages can repeat a film when popularity shifts between requests.
  const movies = useMemo(() => {
    const seen = new Set<number>();
    return (data?.pages.flatMap((p) => p.results) ?? []).filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [data]);
  const genreName = genres?.find((g) => g.id === genre)?.name;

  return (
    <div className="pt-28 sm:pt-32">
      <div className="px-[var(--gutter)]">
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl">
          {genreName ? `${genreName} films` : "All films"}
        </h1>

        <div
          role="radiogroup"
          aria-label="Sort films"
          className="mt-7 inline-flex rounded-full bg-seat p-1"
        >
          {SORTS.map((s) => (
            <Link
              key={s.key}
              to="/movies"
              search={(prev) => ({ ...prev, sort: s.key === "popularity.desc" ? undefined : s.key })}
              role="radio"
              aria-checked={sort === s.key}
              resetScroll={false}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
                sort === s.key ? "bg-screen text-velvet" : "text-dim can-hover:hover:text-screen"
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="rail mt-5 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1" aria-label="Filter by genre">
        <GenreChip active={!genre} label="All" genre={undefined} />
        {genres?.map((g) => (
          <GenreChip key={g.id} active={genre === g.id} label={g.name} genre={g.id} />
        ))}
      </div>

      <div className="mt-8 px-[var(--gutter)]">
        {isError ? (
          <div className="py-16">
            <p className="text-lg text-dim">Couldn't load films. Check your connection, then try again.</p>
            <button type="button" onClick={() => refetch()} className="btn btn-primary mt-6">
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {isLoading
              ? Array.from({ length: 18 }, (_, i) => <PosterSkeleton key={i} />)
              : movies.map((m, i) => <Poster key={m.id} movie={m} eager={i < 6} />)}
            {isFetchingNextPage && Array.from({ length: 6 }, (_, i) => <PosterSkeleton key={`more-${i}`} />)}
          </div>
        )}

        {!isLoading && !isError && movies.length === 0 && (
          <div className="py-16">
            <p className="text-lg text-dim">No films match this filter.</p>
            <Link to="/movies" search={{}} className="btn btn-ghost mt-6">
              Show all films
            </Link>
          </div>
        )}
        {!hasNextPage && movies.length > 0 && (
          <p className="pt-14 text-center text-sm text-faint">That's every film for this filter.</p>
        )}
        <div ref={sentinel} aria-hidden />
      </div>
    </div>
  );
}

function GenreChip({ active, label, genre }: { active: boolean; label: string; genre: number | undefined }) {
  return (
    <Link
      to="/movies"
      search={(prev) => ({ ...prev, genre })}
      resetScroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-sm transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
        active
          ? "bg-lamp font-semibold text-velvet"
          : "text-dim shadow-[inset_0_0_0_1px_rgb(243_236_228/0.14)] can-hover:hover:bg-screen/[0.06] can-hover:hover:text-screen"
      )}
    >
      {label}
    </Link>
  );
}
