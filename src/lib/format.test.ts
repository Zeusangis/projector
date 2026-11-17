import { describe, expect, it, vi } from "vitest";
import { rating, runtime, year } from "./format";

describe("format", () => {
  it("formats runtimes", () => {
    expect(runtime(142)).toBe("2h 22m");
    expect(runtime(45)).toBe("45m");
    expect(runtime(null)).toBe("");
  });
  it("hides ratings nobody has voted on", () => {
    expect(rating(7.84, 1200)).toBe("7.8");
    expect(rating(0, 0)).toBe("");
    expect(rating(6, 0)).toBe("");
  });
  it("takes the year from a release date", () => {
    expect(year("2014-11-05")).toBe("2014");
    expect(year("")).toBe("");
  });
});

describe("nextPageParam", () => {
  it("stops at the last page, and never asks TMDB past page 500", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "test");
    const { nextPageParam } = await import("./tmdb");
    expect(nextPageParam({ page: 1, total_pages: 3 })).toBe(2);
    expect(nextPageParam({ page: 3, total_pages: 3 })).toBeUndefined();
    expect(nextPageParam({ page: 500, total_pages: 41000 })).toBeUndefined();
  });
});
