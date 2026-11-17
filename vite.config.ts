// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // TMDB_TOKEN has no VITE_ prefix, so it never reaches the browser bundle.
  const { TMDB_TOKEN } = loadEnv(mode, process.cwd(), "");

  // Local stand-in for api/tmdb.ts: /api/tmdb/<endpoint> -> TMDB, token added here.
  const tmdbProxy = {
    "/api/tmdb": {
      target: "https://api.themoviedb.org",
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/api\/tmdb/, "/3"),
      headers: { Authorization: `Bearer ${TMDB_TOKEN ?? ""}` },
    },
  };

  return {
    plugins: [
      tailwindcss(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: { proxy: tmdbProxy },
    preview: { proxy: tmdbProxy },
  };
});
