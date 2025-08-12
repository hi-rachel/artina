"use client";

import { useState } from "react";
import ArtworkCard from "@/components/common/ArtworkCard";
import { Artwork } from "@/types/met";

export default function ArtistGallerySlider({
  artworks,
  artistName,
}: {
  artworks: Artwork[];
  artistName: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = artworks.length - 1;

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

  if (artworks.length === 0) {
    return <div className="text-center py-20">작품이 없습니다.</div>;
  }

  return (
    <main className="bg-[#fdf6e3] text-black px-4 py-8 h-screen overflow-hidden flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center font-display mb-8">
        {artistName}
      </h1>
      <div className="relative w-full max-w-3xl flex items-center justify-center mx-auto">
        {/* 왼쪽 화살표 */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow z-10"
            aria-label="이전 작품"
          >
            &#60;
          </button>
        )}
        {/* 그림 */}
        <div className="w-full flex items-center justify-center">
          <ArtworkCard
            imageUrl={artworks[currentIndex].imageUrl}
            title={artworks[currentIndex].title}
            year={artworks[currentIndex].year}
            artist={artworks[currentIndex].artist}
            medium={artworks[currentIndex].medium}
            dimensions={artworks[currentIndex].dimensions}
            description={artworks[currentIndex].description}
          />
        </div>
        {/* 오른쪽 화살표 */}
        {currentIndex < maxIndex && (
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-4xl bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow z-10"
            aria-label="다음 작품"
          >
            &#62;
          </button>
        )}
      </div>
      <div className="mt-4 text-gray-500 text-sm">
        {currentIndex + 1} / {artworks.length}
      </div>
    </main>
  );
}
