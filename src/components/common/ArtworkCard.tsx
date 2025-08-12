"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PaintingLoader from "./PaintingLoader";

interface ArtworkCardProps {
  imageUrl?: string;
  title: string;
  year?: string;
  artist?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
}

const ArtworkCard = ({
  imageUrl,
  title,
  year,
  artist,
  medium,
  dimensions,
  description,
}: ArtworkCardProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageReady, setImageReady] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showPlaceholderFrame = !imageUrl || imgError;

  // 최적화된 이미지 프리로딩 처리
  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setImageReady(false);

    // Intersection Observer를 사용한 lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new window.Image();
            img.src = imageUrl;

            img.onload = () => {
              setTimeout(() => {
                setIsLoading(false);
                setTimeout(() => {
                  setImageReady(true);
                }, 100);
              }, 200); // 로딩 시간 단축
            };

            img.onerror = () => {
              setImgError(true);
              setIsLoading(false);
            };

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    // 5초 타임아웃 (기존 8초에서 단축)
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setTimeout(() => {
          setImageReady(true);
        }, 100);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [imageUrl]);

  // ESC 키로 모달 닫기 및 스크롤 방지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      // ESC 키 이벤트 리스너 추가
      document.addEventListener("keydown", handleKeyDown);
      // 모달 열린 동안 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // 모달 닫힐 때 스크롤 복원
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      <div
        className="h-[80vh] sm:h-[90vh] w-full flex flex-col justify-center items-center text-center px-2 sm:px-6 cursor-pointer"
        onClick={() => imageUrl && !imgError && imageReady && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (imageUrl && !imgError && imageReady) {
              setOpen(true);
            }
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${title} 작품 크게보기`}
      >
        {!showPlaceholderFrame ? (
          <div className="relative h-[50vh] sm:h-[60vh] w-full max-w-2xl flex items-center justify-center overflow-hidden">
            {/* 로딩 애니메이션 - isLoading이 false가 되면 사라짐 */}
            <AnimatePresence>{isLoading && <PaintingLoader />}</AnimatePresence>

            {/* 이미지 - imageReady가 true가 된 경우에만 표시 */}
            <AnimatePresence mode="wait">
              {imageReady && (
                <motion.div
                  key="image-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {/* 최적화된 이미지 표시 */}
                  <div className="relative w-full max-w-2xl h-[50vh] sm:h-[60vh] flex items-center justify-center mb-2 sm:mb-4">
                    <Image
                      ref={imgRef}
                      src={imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain opacity-0"
                      style={{
                        opacity: imageReady ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                      }}
                      onLoad={() => {
                        if (imgRef.current) {
                          imgRef.current.style.opacity = "1";
                        }
                      }}
                      onError={() => setImgError(true)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-[50vh] sm:h-[60vh] w-full max-w-2xl flex items-center justify-center border-1 border-gray-100 bg-white text-gray-400 text-sm rounded mb-2 sm:mb-4">
            {"작품 준비중입니다."}
          </div>
        )}

        <div className="text-center mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700">
          <div className="italic font-medium text-sm sm:text-base">{title}</div>
          <div className="text-gray-500">
            {artist && artist}
            {artist && year && " | "}
            {year && year}
          </div>
          {medium && <div className="mt-1 text-gray-600">{medium}</div>}
          {dimensions && <div className="mt-1 text-gray-600">{dimensions}</div>}
          {description && (
            <div className="mt-1 text-xs text-gray-400">{description}</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl h-[85vh] sm:h-[90vh] flex items-center justify-center"
            >
              <Image
                src={imageUrl || ""}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-contain"
              />

              {/* 작품 정보 - 호버 시에만 표시 (모바일에서는 항상 표시) */}
              <div className="absolute inset-0 group">
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm text-white p-2 sm:p-4 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center">
                    <h2
                      id="modal-title"
                      className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2"
                    >
                      {title}
                    </h2>
                    <div className="text-xs sm:text-sm text-gray-200">
                      {artist && artist}
                      {artist && year && " | "}
                      {year && year}
                    </div>
                    {medium && (
                      <div className="text-xs sm:text-sm text-gray-300 mt-1">
                        {medium}
                      </div>
                    )}
                    {dimensions && (
                      <div className="text-xs sm:text-sm text-gray-300 mt-1">
                        {dimensions}
                      </div>
                    )}
                    {description && (
                      <div className="text-xs text-gray-400 mt-1 sm:mt-2 max-w-2xl mx-auto">
                        {description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtworkCard;
