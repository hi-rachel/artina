"use client";

import Link from "next/link";
import { artistGroups } from "@/data/artistData";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaintingLoader from "@/components/common/PaintingLoader";
import Image from "next/image";

const GalleryLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    // 페이지 로딩 완료 후 로딩 상태 해제
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = (imageUrl: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageUrl]: false }));
  };

  // 컴포넌트 마운트 시 모든 이미지를 로딩 상태로 설정
  useEffect(() => {
    const allImageUrls = Object.values(artistGroups)
      .flat()
      .map((artist) => artist.thumbnailUrl)
      .filter(Boolean);

    const initialLoadingStates = allImageUrls.reduce((acc, url) => {
      if (url) acc[url] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setImageLoadingStates(initialLoadingStates);
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-24 text-gray-900 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-display mb-20 tracking-tight text-center"
      >
        The Artina Gallery
      </motion.h1>

      <div className="w-full max-w-5xl space-y-28">
        {Object.entries(artistGroups).map(([era, artists], eraIndex) => (
          <motion.section
            key={era}
            className="space-y-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: eraIndex * 0.1 }}
          >
            <h2 className="text-lg uppercase text-gray-400 tracking-widest text-left">
              {era}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {artists.map((artist, artistIndex) => (
                <motion.div
                  key={artist.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: eraIndex * 0.1 + artistIndex * 0.05,
                  }}
                >
                  <Link
                    href={`/gallery/${artist.slug}`}
                    className="group block transition-transform duration-200 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#f5f5f5] relative">
                      {artist.thumbnailUrl ? (
                        <>
                          {/* 로딩 애니메이션 */}
                          <AnimatePresence>
                            {imageLoadingStates[artist.thumbnailUrl] && (
                              <PaintingLoader />
                            )}
                          </AnimatePresence>

                          <Image
                            width={500}
                            height={500}
                            src={artist.thumbnailUrl}
                            alt={`${artist.name} 대표 작품`}
                            className="w-full h-full object-cover transition group-hover:scale-105"
                            loading="lazy"
                            onLoad={() => handleImageLoad(artist.thumbnailUrl!)}
                            style={{
                              opacity: imageLoadingStates[artist.thumbnailUrl]
                                ? 0
                                : 1,
                              transition: "opacity 0.3s ease-in-out",
                            }}
                          />
                        </>
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
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg">갤러리를 불러오는 중...</p>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default GalleryLandingPage;
