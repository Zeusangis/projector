/// <reference types="node" />

/**
 * Server-side TMDB proxy (Vercel Function). The browser calls
 * /api/tmdb/<endpoint>; vercel.json rewrites that to /api/tmdb?path=<endpoint>.
 * TMDB_TOKEN lives only on the server, so visitors never see it.
 */

// Only the endpoints the app uses, so this can't be used as a general TMDB proxy.
const ALLOWED =
  /^(trending\/movie\/week|movie\/(popular|top_rated|now_playing|upcoming|\d+)|genre\/movie\/list|discover\/movie|search\/movie)$/;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";
  if (!ALLOWED.test(path)) {
    return Response.json({ status_message: "Not found" }, { status: 404 });
  }

  const token = process.env.TMDB_TOKEN;
  if (!token) {
    return Response.json(
      { status_message: "TMDB_TOKEN is not set on the server" },
      { status: 500 },
    );
  }

  url.searchParams.delete("path");
  const upstream = await fetch(
    `https://api.themoviedb.org/3/${path}?${url.searchParams}`,
    {
      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
    },
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": "application/json",
      // Film data changes slowly: let Vercel's CDN answer repeats for 5 minutes.
      "cache-control": upstream.ok
        ? "public, s-maxage=300, stale-while-revalidate=3600"
        : "no-store",
    },
  });
}
