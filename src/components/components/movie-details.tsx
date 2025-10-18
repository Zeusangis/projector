import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  // Only fetch when dialog is open
  const movie = useGetMoviesById(movieId.toString(), { enabled: open }).data;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="px-10 h-14 text-lg rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer transition">
        <div className="flex items-center space-x-2">
          <span>Details</span>
          <span className="text-lg">›</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        {movie ? (
          <DialogHeader>
            <DialogTitle>{movie.title}</DialogTitle>
            <DialogDescription>{movie.overview}</DialogDescription>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};
