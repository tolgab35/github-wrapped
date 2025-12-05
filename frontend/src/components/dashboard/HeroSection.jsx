import { motion } from "framer-motion";
import { Flame, Code2, FolderGit2, Calendar, Zap } from "lucide-react";

export default function HeroSection({ data, onBack }) {
  const {
    login,
    name,
    avatarUrl,
    totalContributions,
    topLanguages,
    topRepos,
    bestDay,
    streak,
  } = data;

  const metrics = [
    {
      label: "Total Contributions",
      value: totalContributions,
      icon: <Flame size={16} className="text-purple-300" />,
    },
    {
      label: "Top Language",
      value: topLanguages?.[0]?.name,
      icon: <Code2 size={16} className="text-purple-300" />,
    },
    {
      label: "Top Repo",
      value: topRepos?.[0]?.name,
      icon: <FolderGit2 size={16} className="text-purple-300" />,
    },
    {
      label: "Best Day",
      value: bestDay,
      icon: <Calendar size={16} className="text-purple-300" />,
    },
    {
      label: "Longest Streak",
      value: `${streak} days`,
      icon: <Zap size={16} className="text-purple-300" />,
    },
  ];

  return (
    <section className="mb-12 grid gap-10 md:grid-cols-[1.2fr_1fr] items-start">
      {/* LEFT SIDE */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold mb-4 leading-tight"
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
          className="text-base text-white/60 max-w-xl mb-8"
        >
          You made{" "}
          <span className="text-white font-semibold">{totalContributions}</span>{" "}
          total contributions this year. Here’s a quick look at your highlights.
        </motion.p>

        <button
          onClick={onBack}
          className="
            px-5 py-2 rounded-full font-medium
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            text-white shadow-lg hover:brightness-110 hover:scale-[1.02]
            transition-all
          "
        >
          Generate Again
        </button>
      </div>

      {/* RIGHT SIDE CARD */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="
    relative rounded-3xl p-[1px]
    bg-gradient-to-br from-purple-700/10 via-purple-500/5 to-transparent
    shadow-[0_0_25px_rgba(120,80,255,0.15)]
    hover:shadow-[0_0_35px_rgba(140,100,255,0.25)]
    transition-all
  "
      >
        <div
          className="
      bg-[#0d0b1f]/70 backdrop-blur-xl 
      rounded-3xl p-6 
      border border-white/10
      relative overflow-hidden
    "
        >
          {/* Soft spotlight */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/8 to-transparent pointer-events-none" />

          {/* USER INFO */}
          <div className="relative flex items-center gap-4 mb-6 z-10">
            <img
              src={avatarUrl}
              alt={login}
              className="
          w-14 h-14 rounded-full border border-white/10
          shadow-[0_0_18px_rgba(120,80,255,0.25)]
        "
            />
            <div>
              <div className="font-semibold text-base">{name || login}</div>
              <div className="text-xs text-white/50">@{login}</div>
            </div>
          </div>

          {/* METRICS */}
          <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
            {metrics.map((m) => (
              <div
                key={m.label}
                className={`
            bg-white/5 rounded-xl p-4 border border-white/10
            hover:border-purple-300/30 hover:shadow-[0_0_12px_rgba(160,100,255,0.2)]
            transition
            ${m.label === "Longest Streak" ? "col-span-2" : ""}
          `}
              >
                <div className="flex items-center gap-1 text-white/40 text-[11px]">
                  {m.icon}
                  {m.label}
                </div>
                <div className="text-sm font-semibold mt-1">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
