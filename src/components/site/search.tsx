import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { Film, Search as SearchIcon, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { img, useSearch, useTrending, type Movie } from "@/lib/tmdb";
import { rating, year } from "@/lib/format";

const SearchContext = createContext<{ open: () => void } | null>(null);

export function useSearchPalette() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchPalette must be used inside SearchProvider");
  return ctx;
}

function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  // ⌘K / Ctrl+K anywhere, or "/" when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Portal>
          {/* Opened many times a session, so it appears instantly: no animation. */}
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <DialogPrimitive.Content
            className="fixed inset-x-3 top-3 z-50 mx-auto flex max-h-[min(36rem,calc(100dvh-1.5rem))] max-w-xl flex-col overflow-hidden rounded-2xl bg-seat shadow-2xl ring-1 ring-screen/10 outline-none sm:top-[12vh]"
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">Search films</DialogPrimitive.Title>
            {isOpen && <Palette onDone={() => setIsOpen(false)} />}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </SearchContext.Provider>
  );
}

function Palette({ onDone }: { onDone: () => void }) {
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 220);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const searching = debounced.trim().length > 1;
  const { data: found, isFetching, isError } = useSearch(debounced);
  const { data: trending } = useTrending();
  const results: Movie[] = (searching ? found : trending)?.slice(0, 8) ?? [];

  useEffect(() => setActive(0), [debounced]);
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (movie: Movie | undefined) => {
    if (!movie) return;
    onDone();
    navigate({ to: "/movie/$id", params: { id: String(movie.id) } });
  };

  return (
    <>
      <div className="flex items-center gap-3 border-b border-screen/10 px-4">
        <SearchIcon className="size-5 shrink-0 text-dim" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(results[active]);
            }
          }}
          placeholder="Search films by title"
          aria-label="Search films by title"
          role="combobox"
          aria-expanded
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `result-${results[active].id}` : undefined}
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full bg-transparent text-base text-screen placeholder:text-faint outline-none"
        />
        <span className={cn("beam w-10 shrink-0 transition-opacity", isFetching && searching ? "opacity-100" : "opacity-0")} />
      </div>

      <div className="overflow-y-auto overscroll-contain p-2">
        <p className="px-3 pt-2 pb-1.5 text-xs text-faint">
          {searching ? (isError ? "Search isn't responding. Check your connection and try again." : results.length ? "Films" : "") : "Trending this week"}
        </p>
        {searching && !isFetching && !isError && results.length === 0 && (
          <p className="px-3 pb-6 pt-2 text-sm text-dim">
            No films called “{debounced.trim()}”. Check the spelling, or try fewer words.
          </p>
        )}
        <ul ref={listRef} id="search-results" role="listbox" aria-label="Results">
          {results.map((movie, i) => {
            const score = rating(movie.vote_average, movie.vote_count);
            return (
              <li
                key={movie.id}
                id={`result-${movie.id}`}
                data-index={i}
                role="option"
                aria-selected={i === active}
                onPointerMove={() => setActive(i)}
                onClick={() => choose(movie)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2",
                  i === active && "bg-curtain"
                )}
              >
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-curtain">
                  {movie.poster_path ? (
                    <img src={img(movie.poster_path, "w185")} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <Film className="m-auto mt-4 size-5 text-faint" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-screen">{movie.title}</p>
                  <p className="text-xs text-faint">{year(movie.release_date) || "Release date unknown"}</p>
                </div>
                {score && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-lamp">
                    <Star className="size-3 fill-current" />
                    {score}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
