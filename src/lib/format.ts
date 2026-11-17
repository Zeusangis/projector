export function year(date: string | null | undefined) {
  return date ? date.slice(0, 4) : "";
}

export function runtime(minutes: number | null | undefined) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

/** TMDB's 0-10 score with one decimal, or "" when nobody has voted yet. */
export function rating(vote: number | null | undefined, count?: number) {
  if (!vote || count === 0) return "";
  return vote.toFixed(1);
}
