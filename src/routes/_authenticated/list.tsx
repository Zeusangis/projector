import { Link, createFileRoute } from "@tanstack/react-router";

import { Poster } from "@/components/site/poster";
import { useMyList } from "@/lib/my-list";

export const Route = createFileRoute("/_authenticated/list")({
  component: MyList,
});

function MyList() {
  const { list } = useMyList();

  return (
    <div className="px-[var(--gutter)] pt-28 sm:pt-32">
      <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl">My list</h1>
      {list.length === 0 ? (
        <div className="mt-10 max-w-md">
          <p className="text-lg text-dim">
            Films you save show up here. Open any film and choose “Add to my list”.
          </p>
          <Link to="/movies" className="btn btn-primary mt-7">
            Browse films
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-dim">
            {list.length} {list.length === 1 ? "film" : "films"}, newest first. Saved on this device.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {list.map((m) => (
              <Poster key={m.id} movie={m} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
