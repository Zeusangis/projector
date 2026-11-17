import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/site/hero";
import { Rail } from "@/components/site/rail";
import { useMovieList, useTrending } from "@/lib/tmdb";
import { useMyList } from "@/lib/my-list";

export const Route = createFileRoute("/_authenticated/")({
  component: Home,
});

function Home() {
  const trending = useTrending();
  const popular = useMovieList("popular");
  const nowPlaying = useMovieList("now_playing");
  const upcoming = useMovieList("upcoming");
  const topRated = useMovieList("top_rated");
  const { list } = useMyList();

  return (
    <>
      <Hero
        movies={trending.data}
        isLoading={trending.isLoading}
        isError={trending.isError}
        onRetry={() => trending.refetch()}
      />
      <div className="relative z-10 -mt-6">
        <Rail
          title="Top 10 this week"
          ranked
          movies={trending.data?.slice(0, 10)}
          isLoading={trending.isLoading}
        />
        {list.length > 0 && (
          <Rail
            title="My list"
            movies={list}
            more={{ label: "See all", link: { to: "/list" } }}
          />
        )}
        <Rail
          title="Popular right now"
          movies={popular.data}
          isLoading={popular.isLoading}
          more={{ label: "Browse all films", link: { to: "/movies" } }}
        />
        <Rail title="In cinemas" movies={nowPlaying.data} isLoading={nowPlaying.isLoading} />
        <Rail title="Coming soon" movies={upcoming.data} isLoading={upcoming.isLoading} />
        <Rail
          title="All-time favourites"
          movies={topRated.data}
          isLoading={topRated.isLoading}
          more={{ label: "See all", link: { to: "/movies", search: { sort: "vote_average.desc" } } }}
        />
      </div>
    </>
  );
}
