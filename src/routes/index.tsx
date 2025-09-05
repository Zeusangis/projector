import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Navbar from "../components/navbar";

export const Route = createFileRoute("/")({
  component: App,
});
function App() {
  return (
    <div className="App">
      <Navbar />
    </div>
  );
}
