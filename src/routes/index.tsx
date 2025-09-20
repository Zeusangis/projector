import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Navbar from "../components/components/navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import ShowMovies from "@/components/components/showMovies";
import Banner from "@/components/components/banner";

export const Route = createFileRoute("/")({
  component: App,
});
function App() {
  return (
    <div className="App">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col ">
          {/* Hero Section with Shared Background */}
          <div className="relative w-full px-4">
            <Navbar />
            <Banner />
          </div>

          {/* Movies Section */}
          <div className="w-full px-4">
            <ShowMovies />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
