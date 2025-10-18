import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetMoviesById } from "@/lib/tmdb";
export const MovieDetailsDialog = ({ movieId }: { movieId: number }) => {
  const movie = useGetMoviesById(movieId.toString()).data;

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <a className="!px-10 h-14 text-lg rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer transition">
            Details
            <span className="text-lg">›</span>
          </a>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
