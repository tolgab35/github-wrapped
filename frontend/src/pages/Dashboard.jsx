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
import ShareButton from "../components/dashboard/ShareButton";
import RateLimitBanner from "../components/dashboard/RateLimitBanner";

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
          <div
            className="
            flex items-center gap-3 px-4 py-2 rounded-xl
            border border-purple-500/20
            backdrop-blur-sm
          "
          >
            <div className="relative">
              <FiGithub className="text-2xl text-purple-400" />
              <div className="absolute -inset-1 bg-purple-500/20 rounded-full blur-md -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">
                GitHub Wrapped
              </span>
              <span className="text-xs text-purple-300/70">2025</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShareButton username={data.username} />
            <button
              onClick={onBack}
              className="
                group flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-white/5 hover:bg-white/10 
                border border-white/10 hover:border-purple-400/30
                text-white/70 hover:text-white text-sm font-medium
                shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]
                transition-all duration-300 backdrop-blur-sm
              "
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>
        </header>

        {/* Rate Limit Banner */}
        {data.rateLimit && <RateLimitBanner rateLimit={data.rateLimit} />}

        <div className="dashboard-container">
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
        </div>

        <Footer />
      </div>
    </div>
  );
}
