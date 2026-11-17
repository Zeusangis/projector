import { useCallback, useSyncExternalStore } from "react";
import type { Movie } from "./tmdb";

/** The fields a saved film needs to render a poster card. */
export type SavedMovie = Pick<
  Movie,
  "id" | "title" | "poster_path" | "backdrop_path" | "release_date" | "vote_average" | "vote_count"
>;

const KEY = "projector:my-list";
const listeners = new Set<() => void>();
let cache: SavedMovie[] | null = null;

function read(): SavedMovie[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: SavedMovie[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode or full storage: the list still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const EMPTY: SavedMovie[] = [];

export function useMyList() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);

  const has = useCallback((id: number) => list.some((m) => m.id === id), [list]);

  const toggle = useCallback((movie: SavedMovie) => {
    const current = read();
    const exists = current.some((m) => m.id === movie.id);
    const saved: SavedMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
    };
    write(exists ? current.filter((m) => m.id !== movie.id) : [saved, ...current]);
  }, []);

  return { list, has, toggle };
}
