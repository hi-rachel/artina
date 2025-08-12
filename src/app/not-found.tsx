"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#f9f7f0] to-[#f0efe9] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 숫자 애니메이션 */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-8xl md:text-9xl font-display font-bold text-gray-800 mb-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              4
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="inline-block"
            >
              0
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="inline-block"
            >
              4
            </motion.span>
          </h1>
        </motion.div>

        {/* 메인 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-700 mb-4">
            작품을 찾을 수 없습니다
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            찾고 계신 페이지나 작품이 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            아름다운 예술 작품들을 감상하러 갤러리로 돌아가보세요.
          </p>
        </motion.div>

        {/* 장식적 요소들 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mb-12"
        >
          <div className="flex justify-center items-center space-x-4 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 bg-gray-500 rounded-full"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg font-medium transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              홈으로 돌아가기
            </motion.button>
          </Link>

          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-lg font-medium transition-colors hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              갤러리 둘러보기
            </motion.button>
          </Link>
        </motion.div>

        {/* 추가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500 mb-4">
            문제가 지속되면 문의해주세요
          </p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>The Artina Gallery</span>
            <span>•</span>
            <span>예술의 아름다움을 전합니다</span>
          </div>
        </motion.div>

        {/* 배경 장식 요소들 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-32 h-32 border border-gray-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-24 h-24 border border-gray-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              x: [0, 60, 0],
              y: [0, -30, 0],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/4 w-16 h-16 border border-gray-200 rounded-full opacity-15"
          />
        </div>
      </div>
    </main>
  );
}
