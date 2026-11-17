import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useMemo } from "react";

import { img, posterSrcSet, useMovieList, useTrending } from "@/lib/tmdb";

/**
 * Signed-out front door: a wall of this week's posters behind the invitation,
 * like the lobby of a cinema. It stays still: motion is kept for things the
 * user does.
 */
export function Landing() {
  const { data: trending } = useTrending();
  const { data: popular } = useMovieList("popular");

  const columns = useMemo(() => {
    const posters = [...(trending ?? []), ...(popular ?? [])]
      .filter((m, i, all) => m.poster_path && all.findIndex((x) => x.id === m.id) === i)
      .slice(0, 36);
    const cols: (typeof posters)[] = Array.from({ length: 6 }, () => []);
    posters.forEach((p, i) => cols[i % 6].push(p));
    return cols;
  }, [trending, popular]);

  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-[var(--gutter)]">
      <div aria-hidden className="absolute inset-0 -z-10 flex gap-3 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_85%)] sm:gap-4">
        {columns.map((col, c) => (
          <div
            key={c}
            className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4"
            style={{ marginTop: c % 2 ? "-6rem" : "-2rem" }}
          >
            {col.map((m, i) => (
              <img
                key={m.id}
                src={img(m.poster_path, "w185")}
                srcSet={posterSrcSet(m.poster_path)}
                sizes="17vw"
                alt=""
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                className="aspect-[2/3] w-full rounded-lg bg-seat object-cover"
              />
            ))}
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(23_11_14/0.92)_0%,rgb(23_11_14/0.55)_60%,rgb(23_11_14/0.85)_100%)]" />

      <div className="max-w-xl animate-rise text-center">
        <svg viewBox="0 0 28 20" className="mx-auto mb-8 h-8 w-11" aria-hidden>
          <path d="M9 10 L28 2 L28 18 Z" className="fill-lamp/30" />
          <circle cx="7" cy="10" r="6" className="fill-lamp" />
          <circle cx="7" cy="10" r="2.4" className="fill-velvet" />
        </svg>
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.035em]">
          Find something good to watch tonight.
        </h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-lg leading-relaxed text-dim">
          This week's most-watched films, all-time favourites and a list of your own,
          in one place. Free with a Projector account.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <SignUpButton mode="modal">
            <button type="button" className="btn btn-lamp px-7">Create a free account</button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button type="button" className="btn btn-ghost px-7">Sign in</button>
          </SignInButton>
        </div>
      </div>
    </main>
  );
}
