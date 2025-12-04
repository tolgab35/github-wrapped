import { FaMoon, FaRunning, FaStar } from "react-icons/fa";

export default function HighlightsSection({ data }) {
  const { bestDay, streak, totalRepositories } = data;

  const highlights = [
    {
      icon: <FaMoon className="text-yellow-300 text-4xl" />,
      title: "Night Owl",
      desc: `Most commits between 12am–4am. Best day: ${bestDay}.`,
    },
    {
      icon: <FaRunning className="text-orange-400 text-4xl" />,
      title: "Commit Marathoner",
      desc: `Pushed a ${streak}-day commit streak.`,
    },
    {
      icon: <FaStar className="text-blue-400 text-4xl" />,
      title: "Shiny & New",
      desc: `Contributed to ${totalRepositories} public repositories.`,
    },
  ];

  return (
    <section className="mt-10 w-full max-w-6xl mx-auto">
      {/* Outer Glow Container */}
      <div
        className="
          rounded-3xl p-[2px]
          bg-gradient-to-r from-purple-500/40 via-blue-500/30 to-indigo-500/40
          shadow-[0_0_35px_rgba(80,80,255,0.3)]
        "
      >
        {/* Inner Card */}
        <div
          className="
            bg-[#0f1020]/80 rounded-3xl p-8 backdrop-blur-xl
          "
        >
          {/* Title */}
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-8">
            <span className="text-2xl">🏆</span> Top Highlights of the Year
          </h2>

          {/* Highlights Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="
                  bg-[#1b1c33]/70 rounded-2xl p-6 text-center
                  shadow-[0_0_20px_rgba(60,60,150,0.25)]
                  border border-white/5
                "
              >
                <div className="mb-4 flex justify-center">{h.icon}</div>

                <h3 className="text-white font-semibold text-lg mb-2">
                  {h.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
