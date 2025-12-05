import { FiGithub } from "react-icons/fi";
import { useEffect, useState } from "react";

import HeroSection from "../components/dashboard/HeroSection";
import StatsRow from "../components/dashboard/StatsRow";
import HighlightsSection from "../components/dashboard/HighlightsSection";
import TopLanguages from "../components/dashboard/TopLanguages";
import TopRepos from "../components/dashboard/TopRepos";
import CommitActivity from "../components/dashboard/CommitActivity";
import Footer from "../components/dashboard/Footer";
import LoadingScreen from "../components/LoadingScreen";

import generateHighlights from "../lib/generateHighlights";

export default function Dashboard({ data, onBack }) {
  const [generatedHighlights, setGeneratedHighlights] = useState([]);
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(true);

  const generateAIHighlights = async () => {
    try {
      setIsLoadingHighlights(true);
      const highlights = await generateHighlights(data);
      setGeneratedHighlights(highlights);
    } catch (err) {
      console.error("Highlight AI Error:", err);
    } finally {
      setIsLoadingHighlights(false);
    }
  };

  useEffect(() => {
    if (!data) return;
    generateAIHighlights();
  }, [data]);

  if (!data) {
    return (
      <div className="text-white text-center mt-20">
        <p>Loading failed or data missing.</p>
      </div>
    );
  }

  // Show loading screen while highlights are being generated
  if (isLoadingHighlights) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050718] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
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

        <HeroSection data={data} onGoHome={generateAIHighlights} />
        <StatsRow data={data} />

        {/* AI tarafı direkt buraya gidiyor */}
        <HighlightsSection aiHighlights={generatedHighlights} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopLanguages languages={data.topLanguages} />
          <TopRepos repos={data.topRepos} />
        </div>

        <div className="mt-12">
          <CommitActivity monthlyData={data.monthlyCommits} />
        </div>

        <Footer />
      </div>
    </div>
  );
}
