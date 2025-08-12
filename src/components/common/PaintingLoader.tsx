import { motion } from "framer-motion";

const PaintingLoader = () => {
  return (
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
};

export default PaintingLoader;
