"use client";

import { useEffect, useState } from "react";

const ControlsHelp = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); // 10초 후 자동 숨김
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-6 left-6 z-50 pointer-events-none bg-black/50 text-white px-4 py-2 rounded-md text-sm backdrop-blur-sm shadow-lg transition-opacity duration-1000">
      마우스로 드래그: 시점 회전 | 스크롤: 확대/축소 | 우클릭 드래그: 이동
    </div>
  );
};

export default ControlsHelp;
