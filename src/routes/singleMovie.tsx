import MovieDetails from "@/components/components/movie-details";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/singleMovie")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <MovieDetails />
    </div>
  );
}
