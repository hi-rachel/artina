"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArtworkCardProps {
  image?: string;
  title: string;
  year?: string;
  artist?: string;
  medium?: string;
  dimensions?: string;
  description?: string;
}

const ArtworkCard = ({
  image,
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
  const showPlaceholderFrame = !image || imgError;

  // 이미지 프리로딩 처리 - 사전 로딩 방식으로 변경
  useEffect(() => {
    if (!image) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setImageReady(false);

    const preloadImage = new Image();
    preloadImage.src = image;

    const handleLoad = () => {
      // 로딩 상태를 바로 변경하지 않고, 약간의 지연을 두어 로딩 애니메이션이 충분히 보이도록 함
      setTimeout(() => {
        setIsLoading(false);
        // 이미지 로딩 완료 후에 imageReady 상태 변경
        setTimeout(() => {
          setImageReady(true);
        }, 100);
      }, 300);
    };

    const handleError = () => {
      setImgError(true);
      setIsLoading(false);
    };

    preloadImage.onload = handleLoad;
    preloadImage.onerror = handleError;

    // 8초 후에도 로딩이 완료되지 않으면 타임아웃 처리
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);

        // 타임아웃 발생 시에도 약간의 지연 후 이미지 표시
        setTimeout(() => {
          setImageReady(true);
        }, 100);
      }
    }, 8000);

    return () => {
      clearTimeout(timeout);
      preloadImage.onload = null;
      preloadImage.onerror = null;
    };
  }, [image]);

  // 색칠하는 애니메이션 버전
  const renderPaintingLoader = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          className="text-gray-400"
        >
          {/* 캔버스 프레임 */}
          <rect
            x="15"
            y="15"
            width="70"
            height="70"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* 페인트 스트로크 애니메이션 */}
          <motion.path
            d="M25,25 L75,25 L75,75 L25,75 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />

          {/* 색칠되는 영역들 */}
          <motion.rect
            x="25"
            y="25"
            width="50"
            height="15"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          />

          <motion.rect
            x="25"
            y="40"
            width="50"
            height="15"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{
              duration: 0.5,
              delay: 1,
            }}
          />

          <motion.rect
            x="25"
            y="55"
            width="50"
            height="20"
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{
              duration: 0.5,
              delay: 1.5,
            }}
          />
        </svg>
      </div>
    </motion.div>
  );

  return (
    <>
      <div
        className="h-[90vh] w-full flex flex-col justify-center items-center text-center px-6 cursor-pointer"
        onClick={() => image && !imgError && imageReady && setOpen(true)}
      >
        {!showPlaceholderFrame ? (
          <div className="relative h-[60vh] w-full max-w-2xl flex items-center justify-center overflow-hidden">
            {/* 로딩 애니메이션 - isLoading이 false가 되면 사라짐 */}
            <AnimatePresence>
              {isLoading && renderPaintingLoader()}
            </AnimatePresence>

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
                  {/* 미리 로드된 이미지를 화면에 표시 */}
                  <img
                    ref={imgRef}
                    src={image}
                    alt={title}
                    className="max-h-[60vh] max-w-full object-contain mb-4 rounded-lg shadow-md opacity-0"
                    style={{
                      opacity: imageReady ? 1 : 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                    onLoad={() => {
                      // 화면에 표시되는 이미지가 완전히 로드되면 표시
                      if (imgRef.current) {
                        imgRef.current.style.opacity = "1";
                      }
                    }}
                    onError={() => setImgError(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-[60vh] w-full max-w-2xl flex items-center justify-center border-1 border-gray-100 bg-white text-gray-400 text-sm rounded mb-4">
            {"작품 준비중입니다."}
          </div>
        )}

        <div className="text-center mt-2 text-sm text-gray-700">
          <div className="italic font-medium text-base">{title}</div>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={image}
              alt={title}
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtworkCard;
