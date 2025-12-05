import { useState } from "react";
import { motion } from "framer-motion";
import { FiAtSign, FiGithub, FiAlertCircle } from "react-icons/fi";

export default function Home({ onGenerate, error }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = username.trim();
    if (clean) {
      onGenerate(clean);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0d0b1f] relative overflow-hidden">
      {/* Background blur / glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-700/30 blur-[180px] rounded-full left-[-150px] top-[-150px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-[200px] rounded-full right-[-150px] bottom-[-150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          relative z-10 w-[90%] max-w-md 
          bg-white/5 backdrop-blur-xl 
          rounded-2xl p-10 
          border border-white/10 
          shadow-[0_0_60px_rgba(80,80,255,0.3)]
        "
      >
        {/* ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.08 }}
          className="flex justify-center mb-6"
        >
          <div
            className="
              w-14 h-14 
              bg-purple-500/20 
              rounded-full 
              flex items-center justify-center
              shadow-[0_0_25px_rgba(155,90,255,0.45)]
            "
          >
            <FiGithub className="text-purple-300 text-3xl" />
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-center text-white mb-3">
          Your Year in Code
        </h1>

        <p className="text-center text-white/60 mb-8">
          Enter your GitHub username to generate your
          <br />
          2025 Wrapped.
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-red-400 text-xl mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-5">
            <div className="relative">
              <FiAtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full bg-white/10 text-white 
                  pl-12 pr-4 py-3 rounded-full
                  placeholder-white/40
                  border border-white/10
                  focus:outline-none focus:ring-2 focus:ring-purple-500/40
                "
                placeholder="GitHub Username"
                type="text"
              />
            </div>
          </div>

          <button
            type="submit"
            className="
              group relative w-full px-6 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20
              hover:from-purple-600/30 hover:via-pink-600/30 hover:to-indigo-600/30
              border border-purple-500/30 hover:border-purple-400/50
              text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] 
              hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-300 backdrop-blur-sm
              overflow-hidden
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 transition-transform group-hover:scale-110 duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generate Your Wrapped
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
