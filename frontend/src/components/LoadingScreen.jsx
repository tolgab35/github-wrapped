import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080617]">
      {/* ROTATING GLOW RING WITH ICON INSIDE */}
      <motion.div
        className="relative w-24 h-24 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        {/* Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            border: "4px solid rgba(168, 85, 247, 0.45)",
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.8)",
          }}
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* GitHub Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiGithub
            size={36}
            className="text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]"
          />
        </motion.div>
      </motion.div>

      {/* TEXT */}
      <motion.p
        className="text-white/80 mt-10 text-lg tracking-wide"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Generating your Wrapped…
      </motion.p>
    </div>
  );
}
