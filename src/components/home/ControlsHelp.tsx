"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ControlsHelp = () => {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 모바일 디바이스 감지
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 데스크톱에서만 10초 후 자동 숨김
    if (!isMobile) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  // 모바일에서는 아무것도 표시하지 않음
  if (isMobile) {
    return null;
  }

  // 데스크톱에서는 기존 방식 유지
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute bottom-6 left-6 z-50 pointer-events-none bg-black/50 text-white px-4 py-2 rounded-md text-sm backdrop-blur-sm shadow-lg"
    >
      마우스로 드래그: 시점 회전 | 스크롤: 확대/축소 | 우클릭 드래그: 이동
    </motion.div>
  );
};

export default ControlsHelp;
