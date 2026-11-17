# Projector

A website for finding films to watch. It shows this week's top 10, popular films, films in cinemas and films coming soon. You can search, filter by genre and save films to your own list.

Film data comes from [TMDB](https://www.themoviedb.org). You need an account to use the site.

## Run it

1. Install the packages:

   ```bash
   npm install
   ```

2. Make your settings file:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and add your two keys:

   | Key | Where to find it |
   |---|---|
   | `VITE_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API keys |
   | `VITE_TMDB_TOKEN` | TMDB → Settings → API → **API Read Access Token** |

   Never put real keys in `.env.example`. Git saves that file; it ignores `.env`.

4. Start the site:

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000.

## Other commands

| Command | What it does |
|---|---|
| `npm run build` | Builds the site for production |
| `npm test` | Runs the tests |

## Pages

| Address | What you see |
|---|---|
| `/` | Home: a featured film and rows of films |
| `/movies` | All films. Filter by genre, sort, and more load as you scroll |
| `/movie/:id` | One film: details, cast, player and similar films |
| `/list` | Films you saved (stored in your browser) |

Press <kbd>⌘K</kbd>, <kbd>Ctrl K</kbd> or <kbd>/</kbd> to search.

## Built with

React, Vite, TypeScript, TanStack Router and Query, Tailwind CSS, and Clerk for sign-in.

- Pages are in `src/routes/`.
- All TMDB requests are in `src/lib/tmdb.ts`.
- Colours, fonts and animation settings are in `src/styles.css`.

---

This product uses the TMDB API but is not endorsed or certified by TMDB.
