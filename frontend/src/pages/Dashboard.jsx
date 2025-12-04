import { FiAtSign, FiGithub } from "react-icons/fi";
import HeroSection from "../components/dashboard/HeroSection";
import StatsRow from "../components/dashboard/StatsRow";
import HighlightsSection from "../components/dashboard/HighlightsSection";

export default function Dashboard({ data, onBack }) {
  return (
    <div className="min-h-screen bg-[#050718] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FiGithub className="text-2xl text-purple-400" />
            <span className="text-sm font-medium text-white/70">
              GitHub Wrapped
            </span>
          </div>

          <button
            onClick={onBack}
            className="text-xs px-3 py-1 rounded-full border border-white/10 text-white/70 hover:bg-white/5 transition"
          >
            Back
          </button>
        </header>

        {/* Hero + right visual/stat summary section */}
        <HeroSection data={data} />

        {/* Top statistics cards (commits, PRs, etc.) */}
        <StatsRow data={data} />

        <HighlightsSection data={data} />
      </div>
    </div>
  );
}
