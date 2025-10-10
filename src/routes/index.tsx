import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import ShowMovies from "@/components/components/showMovies";
import Banner from "@/components/components/movie-banner";
import Navbar from "@/components/components/navbar";

export const Route = createFileRoute("/")({
  component: App,
});
function App() {
  return (
    <div className="App bg-neutral-900">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col ">
          {/* Hero Section with Shared Background */}
          <Navbar />
          <div className="h-screen">
            <Banner />
          </div>

          {/* Movies Section */}
          <div className="w-full container mx-auto px-4">
            <ShowMovies />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
