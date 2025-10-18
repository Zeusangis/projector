import { useGetMoviesById } from "@/lib/tmdb";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/movie/$id")({
  // In a loader
  loader: ({ params }) => params.id,
  // Or in a component
  component: SingleMovieComponent,
});

function SingleMovieComponent() {
  // In a component!
  const { id } = Route.useParams();
  const { data: movie, isLoading, error } = useGetMoviesById(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  if (!movie) return <div>No movie found.</div>;

  return (
    <div>
      <div>Movie ID: {id}</div>
      <div>Title: {movie.title}</div>
      {/* Add more movie details as needed */}
      <div>
        <iframe
          className="w-full h-[80vh] rounded-lg"
          src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
