"use client";

import { useState } from "react";
import ArtworkCard from "@/components/common/ArtworkCard";
import { Artwork } from "@/types/met";

interface SlideGalleryProps {
  artworks: Artwork[];
}

const SlideGallery = ({ artworks }: SlideGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = artworks.length - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${artworks.length * 100}%`,
        }}
      >
        {artworks.map((art, idx) => (
          <div key={idx} className="w-full flex-shrink-0 px-4">
            <ArtworkCard
              imageUrl={art.imageUrl}
              title={art.title}
              year={art.year}
              artist={art.artist}
              medium={art.medium}
              dimensions={art.dimensions}
              description={art.description}
            />
          </div>
        ))}
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl bg-white/90 px-3 py-2 rounded-full shadow z-10"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl bg-white/90 px-3 py-2 rounded-full shadow z-10"
      >
        ▶
      </button>
    </div>
  );
};

export default SlideGallery;
