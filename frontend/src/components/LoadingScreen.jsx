import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="absolute inset-0 bg-[#0d0b1f] flex flex-col items-center justify-center z-50">
      {/* Glow background */}
      <div className="absolute w-[600px] h-[600px] bg-purple-700/30 blur-[200px] rounded-full" />

      {/* Spinning animation */}
      <motion.div
        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      ></motion.div>

      {/* GitHub Wrapped loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="text-white/70 text-lg mt-3 relative"
      >
        Generating your Wrapped...
      </motion.p>
    </div>
  );
}
