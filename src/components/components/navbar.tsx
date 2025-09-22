import { UserButton } from "@clerk/clerk-react";
import { Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0  z-50">
      <div className="relative z-20 flex justify-between items-center py-6 px-4 container mx-auto">
        <div className="flex items-center gap-6 text-white">
          <div>
            <span className="text-2xl font-bold drop-shadow-lg">Projector</span>
          </div>
          <div>
            <ul className="flex gap-6 items-center">
              <li className="hover:text-gray-300 transition-colors cursor-pointer drop-shadow">
                <a href="/">Home</a>
              </li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer drop-shadow">
                <a href="/movies">Movies</a>
              </li>
              <li className="hover:text-gray-300 transition-colors cursor-pointer drop-shadow">
                Series
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-6 items-center text-white">
          <Search className="hover:text-gray-300 transition-colors cursor-pointer drop-shadow" />
          <UserButton />
        </div>
      </div>
    </nav>
  );
}
