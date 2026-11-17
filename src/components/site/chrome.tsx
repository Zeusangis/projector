import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/clerk-react";
import { Bookmark, Clapperboard, House, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSearchPalette } from "./search";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2", className)} aria-label="Projector home">
      {/* The lamp: a small amber light with its beam. */}
      <svg viewBox="0 0 28 20" className="h-5 w-7" aria-hidden>
        <path d="M9 10 L28 2 L28 18 Z" className="fill-lamp/25 transition-[fill-opacity] duration-300 can-hover:group-hover:fill-lamp/45" />
        <circle cx="7" cy="10" r="6" className="fill-lamp" />
        <circle cx="7" cy="10" r="2.4" className="fill-velvet" />
      </svg>
      <span className="font-display text-xl font-extrabold tracking-[-0.03em]">Projector</span>
    </Link>
  );
}

const links = [
  { to: "/", label: "Home", icon: House, exact: true },
  { to: "/movies", label: "Films", icon: Clapperboard, exact: false },
  { to: "/list", label: "My list", icon: Bookmark, exact: false },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useSearchPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "bg-velvet/80 shadow-[0_1px_0_rgb(243_236_228/0.06)] backdrop-blur-xl"
          : "bg-gradient-to-b from-velvet/70 to-transparent"
      )}
    >
      <nav className="flex h-16 items-center gap-8 px-[var(--gutter)]" aria-label="Main">
        <Logo />
        <ul className="hidden items-center gap-6 text-[15px] sm:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.exact, includeSearch: false }}
                className="relative py-2 text-dim transition-colors duration-200 can-hover:hover:text-screen data-[status=active]:text-screen after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-lamp after:transition-transform after:duration-300 after:ease-[var(--ease-out)] data-[status=active]:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={open}
            className="flex h-10 items-center gap-2 rounded-full px-3 text-dim transition-[background-color,color] duration-200 can-hover:hover:bg-screen/10 can-hover:hover:text-screen sm:bg-screen/[0.07] sm:pr-2 sm:pl-3.5"
          >
            <Search className="size-[18px]" />
            <span className="hidden text-sm sm:inline">Search</span>
            <kbd className="hidden rounded-md bg-screen/10 px-1.5 py-0.5 font-sans text-[11px] text-dim lg:inline">⌘K</kbd>
            <span className="sr-only sm:hidden">Search</span>
          </button>
          <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
        </div>
      </nav>
    </header>
  );
}

/** Thumb-reach navigation on phones. */
export function MobileTabs() {
  const { open } = useSearchPalette();
  const item =
    "flex flex-1 flex-col items-center gap-1 pt-2.5 text-[11px] text-faint transition-colors duration-200 active:scale-95 data-[status=active]:text-lamp";
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-screen/[0.07] bg-velvet/90 pb-[max(env(safe-area-inset-bottom),0.6rem)] backdrop-blur-xl sm:hidden"
    >
      {links.slice(0, 2).map((l) => (
        <Link key={l.to} to={l.to} activeOptions={{ exact: l.exact, includeSearch: false }} className={item}>
          <l.icon className="size-5" />
          {l.label}
        </Link>
      ))}
      <button type="button" onClick={open} className={item}>
        <Search className="size-5" />
        Search
      </button>
      <Link to="/list" className={item}>
        <Bookmark className="size-5" />
        My list
      </Link>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-screen/[0.07] px-[var(--gutter)] pt-10 pb-28 text-sm text-faint sm:pb-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="text-screen" />
        <p className="max-w-[60ch]">
          Film data and images come from{" "}
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-dim underline-offset-4 can-hover:hover:text-screen can-hover:hover:underline">
            TMDB
          </a>
          . Projector uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}
