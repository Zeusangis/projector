import { UserButton } from "@clerk/clerk-react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={` top-0  z-90 sticky ${isScrolled ? "bg-neutral-900 bg-opacity-70 backdrop-blur-md" : "bg-transparent"} transition-colors duration-300`}
    >
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
