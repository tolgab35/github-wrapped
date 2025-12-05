import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiCode, FiStar, FiTrendingUp } from "react-icons/fi";
import { useEffect, useState } from "react";

const loadingStages = [
  { text: "Analyzing your GitHub profile...", icon: FiGithub, duration: 2000 },
  { text: "Fetching your repositories...", icon: FiCode, duration: 2000 },
  {
    text: "Calculating your statistics...",
    icon: FiTrendingUp,
    duration: 2000,
  },
  { text: "Generating personalized insights...", icon: FiStar, duration: 2000 },
];

export default function LoadingScreen({ stage = "default" }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== "fetching") return;

    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < loadingStages.length - 1) return prev + 1;
        return prev;
      });
    }, loadingStages[currentStage]?.duration || 2000);

    return () => clearInterval(stageInterval);
  }, [currentStage, stage]);

  useEffect(() => {
    if (stage !== "fetching") return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 10;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, [stage]);

  const CurrentIcon =
    stage === "fetching"
      ? loadingStages[currentStage]?.icon || FiGithub
      : FiGithub;

  const displayText =
    stage === "fetching"
      ? loadingStages[currentStage]?.text || "Generating your Wrapped…"
      : stage === "highlights"
      ? "Generating AI-powered highlights..."
      : "Generating your Wrapped…";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050718]">
      {/* Background glow effects matching Home page */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-700/20 blur-[180px] rounded-full left-[-150px] top-[-150px]" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[200px] rounded-full right-[-150px] bottom-[-150px]" />
      </div>

      {/* ROTATING GLOW RING WITH ICON INSIDE */}
      <motion.div
        className="relative w-24 h-24 flex items-center justify-center z-10"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        {/* Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-purple-500/30"
          style={{
            boxShadow:
              "0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(236, 72, 153, 0.3)",
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* GitHub Icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <CurrentIcon
              size={36}
              className="text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* TEXT */}
      <AnimatePresence mode="wait">
        <motion.p
          key={displayText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative z-10 text-white/80 mt-10 text-lg tracking-wide text-center px-4"
        >
          {displayText}
        </motion.p>
      </AnimatePresence>

      {/* PROGRESS BAR */}
      {stage === "fetching" && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          className="relative z-10 mt-8 w-64 max-w-[80%]"
        >
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-indigo-600/40 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: "0 0 10px rgba(168, 85, 247, 0.3)",
              }}
            />
          </div>
          <motion.p
            className="text-center text-white/50 text-sm mt-2 font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {Math.floor(progress)}%
          </motion.p>
        </motion.div>
      )}

      {/* SUBTLE LOADING DOTS */}
      <div className="relative z-10 flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
            style={{
              boxShadow: "0 0 8px rgba(168, 85, 247, 0.6)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
