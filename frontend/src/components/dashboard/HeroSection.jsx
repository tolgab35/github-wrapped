import { motion } from "framer-motion";

export default function HeroSection({ data, onBack }) {
  const {
    login,
    name,
    avatarUrl,
    streak,
    bestDay,
    totalContributions,
    totalCommits,
    totalPRs,
  } = data;

  return (
    <section className="mb-10 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
      {/* Left side: title + description + button */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
        >
          Your {new Date().getFullYear()} GitHub{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Wrapped
          </span>{" "}
          is here!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm md:text-base text-white/60 max-w-xl mb-6"
        >
          A personalized summary of your coding journey over the past year. See
          your top languages, biggest projects, and unique coding habits.
        </motion.p>

        <button
          onClick={onBack}
          className="
    mt-6 px-5 py-2 rounded-full font-medium
    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    text-white shadow-lg hover:brightness-110 hover:scale-[1.02]
    transition-all
  "
        >
          Generate Again
        </button>
      </div>

      {/* Right side: small card / avatar / short summary */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="
          bg-white/5 backdrop-blur-xl rounded-3xl
          border border-white/10
          p-5 flex flex-col gap-4
          shadow-[0_0_40px_rgba(80,80,255,0.3)]
        "
      >
        {/* User info */}
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={login}
            className="w-10 h-10 rounded-full border border-white/20"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{name || login}</span>
            <span className="text-xs text-white/60">@{login}</span>
          </div>
        </div>

        {/* Mini highlights */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/10">
            <div className="text-[10px] text-white/60 mb-1">
              Total Contributions
            </div>
            <div className="text-lg font-semibold">{totalContributions}</div>
          </div>

          <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/10">
            <div className="text-[10px] text-white/60 mb-1">Longest Streak</div>
            <div className="text-lg font-semibold">{streak || 0} days</div>
          </div>

          <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/10">
            <div className="text-[10px] text-white/60 mb-1">Best Day</div>
            <div className="text-sm font-semibold">{bestDay}</div>
          </div>

          <div className="bg-white/5 rounded-2xl px-3 py-2 border border-white/10">
            <div className="text-[10px] text-white/60 mb-1">Commits & PRs</div>
            <div className="text-sm font-semibold">
              {totalCommits} commits • {totalPRs} PRs
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
