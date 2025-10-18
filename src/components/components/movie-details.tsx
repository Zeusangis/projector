"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetMoviesById } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Play, Plus, ThumbsUp, Volume2 } from "lucide-react";

export const MovieDetailsDialog = ({
  movieId,
  mode = "card",
}: {
  movieId: number;
  mode?: "banner" | "card";
}) => {
  const [open, setOpen] = useState(false);

  // Only fetch when dialog is open
  const movie = useGetMoviesById(movieId.toString(), { enabled: open }).data;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {mode === "banner" ? (
          <DialogTrigger className="px-10 h-14 text-lg rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer transition">
            <div className="flex items-center space-x-2">
              <span>Details</span>
              <span className="text-lg">›</span>
            </div>
          </DialogTrigger>
        ) : (
          <div
            className="w-full rounded-full z-5 bg-white h-10 hover:bg-gray-200 cursor-pointer text-gray-800 flex items-center justify-center"
            onClick={() => setOpen(true)}
          >
            <div className="flex items-center space-x-2">
              <span>Details</span>
              <span className="text-lg">›</span>
            </div>
          </div>
        )}
        <DialogContent
          className="max-w-4xl p-0 bg-neutral-900 border-none overflow-hidden"
          showCloseButton={true}
        >
          {movie ? (
            <div className="relative">
              {/* Background Image with Gradient Overlay - Netflix Style */}
              <div className="relative h-[400px] w-full">
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Gradient Overlay matching banner style */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
                </div>

                {/* Title and Action Buttons Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <a
                      href={`movie/${movie.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="px-8 h-12 text-base bg-white text-black rounded-md hover:bg-gray-200 font-semibold">
                        <Play className="mr-2 h-5 w-5 fill-current" />
                        Play
                      </Button>
                    </a>
                    <button className="w-12 h-12 rounded-full border-2 border-gray-400 bg-neutral-900/50 hover:border-white transition flex items-center justify-center">
                      <Plus className="h-6 w-6 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-gray-400 bg-neutral-900/50 hover:border-white transition flex items-center justify-center">
                      <ThumbsUp className="h-5 w-5 text-white" />
                    </button>
                    <button className="w-12 h-12 rounded-full border-2 border-gray-400 bg-neutral-900/50 hover:border-white transition flex items-center justify-center ml-auto">
                      <Volume2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Movie Details Section */}
              <div className="p-8 bg-neutral-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Main Info */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-500 font-semibold">
                        {Math.round(movie.vote_average * 10)}% Match
                      </span>
                      <span className="text-gray-400">
                        {movie.release_date?.split("-")[0]}
                      </span>
                      {movie.runtime && (
                        <span className="text-gray-400">
                          {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}
                          m
                        </span>
                      )}
                      <span className="px-2 py-0.5 border border-gray-500 text-gray-400 text-xs">
                        HD
                      </span>
                    </div>
                    <p className="text-white text-base leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>

                  {/* Right Column - Additional Info */}
                  <div className="space-y-3 text-sm">
                    {movie.genres && movie.genres.length > 0 && (
                      <div>
                        <span className="text-gray-500">Genres: </span>
                        <span className="text-white">
                          {movie.genres.map((g: any) => g.name).join(", ")}
                        </span>
                      </div>
                    )}
                    {movie.vote_average && (
                      <div>
                        <span className="text-gray-500">Rating: </span>
                        <span className="text-white">
                          {movie.vote_average.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                    {movie.original_language && (
                      <div>
                        <span className="text-gray-500">Language: </span>
                        <span className="text-white uppercase">
                          {movie.original_language}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center bg-neutral-900">
              <div className="text-white text-lg">Loading...</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
