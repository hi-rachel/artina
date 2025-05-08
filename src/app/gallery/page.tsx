"use client";

import Link from "next/link";
import { artistGroups } from "@/data/artistData";

const GalleryLandingPage = () => {
  return (
    <main className="min-h-screen bg-white px-6 py-24 text-gray-900 flex flex-col items-center">
      <h1 className="text-5xl font-display mb-20 tracking-tight text-center">
        The Metropolitan Museum of Art
      </h1>

      <div className="w-full max-w-5xl space-y-28">
        {Object.entries(artistGroups).map(([era, artists]) => (
          <section key={era} className="space-y-10">
            <h2 className="text-lg uppercase text-gray-400 tracking-widest text-left">
              {era}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {artists.map((artist) => (
                <Link
                  key={artist.slug}
                  href={`/gallery/${artist.slug}`}
                  className="group block transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#f5f5f5]">
                    {artist.thumbnailUrl ? (
                      <img
                        src={artist.thumbnailUrl}
                        alt={`${artist.name} 대표 작품`}
                        className="w-full h-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl font-bold">
                        {artist.slug.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-display text-gray-900 group-hover:underline">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{artist.slug}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default GalleryLandingPage;
