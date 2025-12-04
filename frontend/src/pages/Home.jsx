import { useState } from "react";
import { motion } from "framer-motion";
import { FiAtSign, FiGithub } from "react-icons/fi";

export default function Home({ onGenerate }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onGenerate(username);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0d0b1f] relative overflow-hidden">
      {/* Background blur / glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-700/30 blur-[180px] rounded-full left-[-150px] top-[-150px]" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600/30 blur-[200px] rounded-full right-[-150px] bottom-[-150px]" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="
          relative z-10 w-[90%] max-w-md 
          bg-white/5 backdrop-blur-xl 
          rounded-3xl p-10 
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

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-white mb-3">
          Your Year in Code
        </h1>
        <p className="text-center text-white/60 mb-8">
          Enter your GitHub username to generate your
          <br />
          2025 Wrapped.
        </p>

        {/* Input */}
        <form onSubmit={handleSubmit}>
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

          {/* Button */}
          <button
            type="submit"
            className="
              w-full py-3 rounded-full font-semibold 
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              text-white shadow-lg
              hover:brightness-110 hover:scale-[1.02]
              transition-all
            "
          >
            Generate Your Wrapped
          </button>
        </form>
      </motion.div>
    </div>
  );
}
