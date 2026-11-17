# Projector

Find something good to watch tonight. A film browser built on [TMDB](https://www.themoviedb.org): this week's top 10, what's popular, in cinemas and coming soon, every film filterable by genre, search, and a list of your own.

## Setup

```bash
npm install
cp .env.example .env   # then fill in both keys
npm run dev            # http://localhost:3000
```

| Variable | Where to get it |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API keys |
| `VITE_TMDB_TOKEN` | TMDB → Settings → API → **API Read Access Token** |

`npm run build` builds for production, `npm test` runs the tests.

## How it's built

- **React 19 + Vite**, TypeScript, **TanStack Router** (file routes in `src/routes/`) and **TanStack Query**.
- **Clerk** for accounts. Every page sits under `src/routes/_authenticated.tsx`, which shows the landing page to signed-out visitors.
- **Tailwind v4**. The palette, fonts and motion curves live in `src/styles.css` under `@theme`.
- All TMDB calls go through `src/lib/tmdb.ts`. "My list" is saved in the browser (`src/lib/my-list.ts`).

| Route | Page |
|---|---|
| `/` | Featured films, top 10 and rails |
| `/movies?genre=&sort=` | Every film, filterable, loads as you scroll |
| `/movie/:id` | Film page with cast, player and similar films |
| `/list` | My list |

Search opens with the search button, <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> or <kbd>/</kbd>.

Film data and images: TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
