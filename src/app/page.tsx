"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ControlsHelp from "@/components/home/ControlsHelp";

// 클라이언트 사이드에서만 Three.js 컴포넌트 로드 (SSR 비활성화)
const GalleryElegant = dynamic(
  () => import("../components/home/GalleryElegant"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">갤러리 로딩 중...</p>
          <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-black w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    ),
  }
);

// 메인 홈페이지 컴포넌트
const HomePage = () => {
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleEnterGallery = (): void => {
    setIsEntering(true);
  };

  const handleAnimationComplete = (): void => {
    setHasEntered(true);
  };

  useEffect(() => {
    // 초기 로딩 대기 시간
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-xl mb-4">Artina 갤러리 불러오는 중...</p>
            <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* 3D 배경 (클라이언트 사이드에서만 렌더링) */}
      {!isLoading && (
        <div className="fixed inset-0 z-0">
          <GalleryElegant
            isAnimating={isEntering}
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
      )}

      {/* UI 오버레이 */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {!isLoading && !isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center pointer-events-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl font-bold mb-6 text-white drop-shadow-lg"
            >
              Artina에 오신 걸 환영합니다
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-10 text-white text-xl drop-shadow-md"
            >
              Where art meets you
            </motion.p>

            <motion.button
              onClick={handleEnterGallery}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white bg-opacity-90 text-black rounded-xl shadow-2xl text-lg font-medium transition-all hover:bg-opacity-100"
            >
              입장하기 →
            </motion.button>
          </motion.div>
        )}

        {/* 추가된 하단 정보 */}
        {!isLoading && !isEntering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-auto"
          >
            <div className="text-center text-white drop-shadow-md mx-4">
              <p className="text-sm mb-1 opacity-80">
                온라인에서 언제든지 편하게 전시를 즐기세요
              </p>
              <p className="text-sm mb-1 opacity-80">@2025 hi-rachel</p>

              {/* <div className="flex justify-center gap-6 mt-2">
                <div className="text-center">
                  <div className="inline-block w-3 h-3 bg-green-400 rounded-full mb-1 animate-pulse"></div>
                  <p className="text-xs font-light">실시간 전시</p>
                </div>
                <div className="text-center">
                  <div className="inline-block w-3 h-3 bg-blue-400 rounded-full mb-1"></div>
                  <p className="text-xs font-light">다가오는 이벤트</p>
                </div>
                <div className="text-center">
                  <div className="inline-block w-3 h-3 bg-purple-400 rounded-full mb-1"></div>
                  <p className="text-xs font-light">아티스트 모집</p>
                </div>
              </div> */}
            </div>
          </motion.div>
        )}

        {/* 애니메이션 진행 중 로딩 인디케이터 */}
        {!isLoading && isEntering && !hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-0 right-0 text-center text-white pointer-events-auto"
          >
            <div className="inline-block bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm">
              <p className="text-lg font-light">갤러리 투어 중...</p>
            </div>
          </motion.div>
        )}

        {/* 애니메이션 완료 후 갤러리 페이지로 이동 버튼 */}
        {!isLoading && hasEntered && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-10 right-10 pointer-events-auto"
            >
              <Link href="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-black rounded-xl shadow-xl transition-all hover:bg-opacity-90"
                >
                  전시 관람하기 →
                </motion.button>
              </Link>
            </motion.div>
            <ControlsHelp />
          </>
        )}
      </div>
    </main>
  );
};

export default HomePage;
