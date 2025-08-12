"use client";

import { useEffect, useRef } from "react";

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

const HorizontalScrollContainer = ({
  children,
  className = "",
}: HorizontalScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.5;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex overflow-x-auto overflow-y-hidden gap-4 sm:gap-6 px-2 sm:px-4 snap-x snap-mandatory scroll-smooth scrollable-x w-full relative ${className}`}
      style={{
        height: "calc(100vh - 140px)",
        minHeight: "350px",
        scrollBehavior: "smooth",
        width: "100%",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

export default HorizontalScrollContainer;
