import { motion } from "framer-motion";
import {
  Flame,
  Code2,
  FolderGit2,
  Calendar,
  Zap,
  Award,
  Trophy,
  Star,
  Target,
} from "lucide-react";

export default function HeroSection({ data, onGoHome, onGenerateAgain }) {
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

  // Generate achievement badges based on user stats
  const badges = [];

  if (totalContributions >= 500) {
    badges.push({
      icon: <Trophy size={18} />,
      label: "Elite Contributor",
      color: "from-yellow-500 to-orange-500",
    });
  } else if (totalContributions >= 200) {
    badges.push({
      icon: <Award size={18} />,
      label: "Active Developer",
      color: "from-blue-500 to-cyan-500",
    });
  }

  if (streak >= 7) {
    badges.push({
      icon: <Flame size={18} />,
      label: `${streak} Day Streak`,
      color: "from-orange-500 to-red-500",
    });
  }

  if (topLanguages?.length > 0) {
    badges.push({
      icon: <Code2 size={18} />,
      label: `${topLanguages[0].name} Master`,
      color: "from-purple-500 to-pink-500",
    });
  }

  if (topRepos?.length >= 3) {
    badges.push({
      icon: <Star size={18} />,
      label: "Polyglot",
      color: "from-green-500 to-emerald-500",
    });
  }

  if (totalContributions >= 365) {
    badges.push({
      icon: <Target size={18} />,
      label: "Daily Coder",
      color: "from-indigo-500 to-purple-500",
    });
  }

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
    <section className="mb-12 grid gap-10 md:grid-cols-[1.2fr_1fr] items-stretch">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-5">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold leading-tight"
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
          className="text-base text-white/60 max-w-xl"
        >
          You made{" "}
          <span className="text-white font-semibold">{totalContributions}</span>{" "}
          total contributions this year. Here's a quick look at your highlights.
        </motion.p>

        {/* BADGES */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <Award size={20} className="text-purple-400" />
              <span className="text-xl font-semibold text-white/80">
                Your Achievements
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {badges.map((badge, idx) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                  className={`
                    flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl
                    bg-gradient-to-br ${badge.color}
                    text-white font-medium
                    shadow-lg hover:scale-105 hover:shadow-xl
                    transition-all cursor-default w-[105px] h-[80px]
                  `}
                >
                  <div className="text-xl">{badge.icon}</div>
                  <span className="text-xs text-center leading-tight">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <button
          onClick={onGenerateAgain}
          className="
            group relative px-6 py-3 rounded-xl font-semibold text-sm
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
              className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Generate Again
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* RIGHT SIDE CARD */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="
    relative rounded-2xl p-[1px]
    bg-gradient-to-br from-purple-700/10 via-purple-500/5 to-transparent
    shadow-[0_0_25px_rgba(120,80,255,0.15)]
    hover:shadow-[0_0_35px_rgba(140,100,255,0.25)]
    transition-all h-full
  "
      >
        <div
          className="
      bg-[#0d0b1f]/70 backdrop-blur-xl 
      rounded-2xl p-6 
      border border-white/10
      relative overflow-hidden h-full flex flex-col
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
          <div className="grid grid-cols-2 gap-4 mt-2 relative z-10 flex-1">
            {metrics.map((m) => (
              <div
                key={m.label}
                className={`
            bg-white/5 rounded-xl p-4 border border-white/10
            hover:border-purple-300/30 hover:shadow-[0_0_12px_rgba(160,100,255,0.2)]
            transition flex flex-col justify-center
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
