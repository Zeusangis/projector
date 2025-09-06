import { UserButton } from "@clerk/clerk-react";
import { Search } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center py-6 px-4">
      <div className="flex items-center gap-6 text-black dark:text-white">
        <div>
          <span className="text-2xl font-bold">Projector</span>
        </div>
        <div>
          <ul className="flex gap-6 items-center">
            <li>Home</li>
            <li>Movies</li>
            <li>Series</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <Search />
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}
