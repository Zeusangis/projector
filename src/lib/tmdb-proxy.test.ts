import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "../../api/tmdb";

const call = (path: string) => GET(new Request(`https://projector.test/api/tmdb?${path}`));

describe("TMDB proxy", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("forwards allowed endpoints with the server token and keeps the query", async () => {
    vi.stubEnv("TMDB_TOKEN", "secret");
    const fetchMock = vi.fn(async () => new Response('{"results":[]}', { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await call("path=search/movie&query=dune&language=en-US");

    expect(res.status).toBe(200);
    const [target, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(target).toBe("https://api.themoviedb.org/3/search/movie?query=dune&language=en-US");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer secret");
  });

  it("refuses endpoints the app doesn't use", async () => {
    vi.stubEnv("TMDB_TOKEN", "secret");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    for (const path of ["account", "movie/550/rating", "../3/account", "movie/abc", ""]) {
      expect((await call(`path=${encodeURIComponent(path)}`)).status).toBe(404);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says so when the token is missing", async () => {
    vi.stubEnv("TMDB_TOKEN", "");
    expect((await call("path=genre/movie/list")).status).toBe(500);
  });
});
