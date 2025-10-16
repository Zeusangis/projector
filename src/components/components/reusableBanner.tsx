import { Button } from "../ui/button";
import { Play } from "lucide-react";

interface ReusableBannerProps {
  // You can add props here if needed in the future
  backgroundImageUrl?: string;
  title?: string;
  overview?: string;
  onWatchNowClick?: () => void;
  onDetailsClick?: () => void;
}

function ReusableBanner({
  backgroundImageUrl,
  title,
  overview,
  onWatchNowClick,
  onDetailsClick,
}: ReusableBannerProps) {
  return (
    <>
      {/* Background Image Container */}
      <div
        className="absolute inset-0 w-full h-full "
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 from-30% to-transparent opacity-70"></div>
      </div>

      {/* Content */}
      <div className="flex items-center container mx-auto relative z-10 h-full -mt-32">
        <div className=" max-w-2xl px-4">
          <div className="flex flex-col text-start gap-4">
            <div className="text-white">
              <h1 className="text-2xl md:text-5xl font-bold">{title}</h1>
              <p className="text-lg md:text-xl mt-2 opacity-90">
                {overview?.slice(0, 180)}...
              </p>
            </div>
            <div className="space-x-5">
              <Button
                onClick={onWatchNowClick}
                className="!px-10 h-14 text-lg bg-white text-black cursor-pointer rounded-full hover:bg-gray-200 "
              >
                <span> Watch Now</span>
                <Play className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={onDetailsClick}
                className="!px-10 h-14 text-lg rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer transition"
              >
                Details
                <span className="text-lg">›</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReusableBanner;
