import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Navbar from "../components/navbar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

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
        <Navbar />
      </SignedIn>
    </div>
  );
}
