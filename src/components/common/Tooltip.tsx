"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  message: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Tooltip = ({
  children,
  message,
  position = "top",
  className = "",
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800",
    right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800",
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    // 화면 경계 체크를 위한 지연
    setTimeout(() => {
      const tooltipElement = document.querySelector(
        "[data-tooltip]"
      ) as HTMLElement;
      if (tooltipElement) {
        const rect = tooltipElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newPosition = position;

        // 왼쪽 경계 체크
        if (rect.left < 0 && position === "left") {
          newPosition = "right";
        }
        // 오른쪽 경계 체크
        if (rect.right > viewportWidth && position === "right") {
          newPosition = "left";
        }
        // 위쪽 경계 체크
        if (rect.top < 0 && position === "top") {
          newPosition = "bottom";
        }
        // 아래쪽 경계 체크
        if (rect.bottom > viewportHeight && position === "bottom") {
          newPosition = "top";
        }

        setAdjustedPosition(newPosition);
      }
    }, 10);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsVisible(false);
        setAdjustedPosition(position);
      }}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[adjustedPosition]}`}
            data-tooltip
          >
            <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-nowrap">
              {message}
              <div
                className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[adjustedPosition]}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
