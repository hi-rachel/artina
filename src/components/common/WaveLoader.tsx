import { motion } from "framer-motion";

interface WaveLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "gray" | "white";
}

const WaveLoader = ({ size = "md", color = "gray" }: WaveLoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const colorClasses = {
    gray: "bg-gray-400",
    white: "bg-white",
  };

  const bars = [0, 1, 2, 3, 4]; // 5개의 세로 바

  return (
    <div
      className={`flex items-center justify-center gap-1 ${sizeClasses[size]}`}
    >
      {bars.map((index) => (
        <motion.div
          key={index}
          className={`w-0.5 ${colorClasses[color]} rounded-full`}
          initial={{ height: "20%" }}
          animate={{
            height: ["20%", "80%", "20%"],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default WaveLoader;
