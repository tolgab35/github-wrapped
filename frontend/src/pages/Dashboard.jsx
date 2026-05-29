import { useState, useEffect } from "react";

import HeroSection from "../components/dashboard/HeroSection";
import StatsRow from "../components/dashboard/StatsRow";
import HighlightsSection from "../components/dashboard/HighlightsSection";
import TopLanguages from "../components/dashboard/TopLanguages";
import TopRepos from "../components/dashboard/TopRepos";
import CommitActivity from "../components/dashboard/CommitActivity";
import Footer from "../components/dashboard/Footer";
import RateLimitBanner from "../components/dashboard/RateLimitBanner";
import ShareCard from "../components/dashboard/ShareCard";
import Reveal from "../components/Reveal";
import generateHighlights from "../lib/generateHighlights";

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 34, height: 34, borderRadius: 8, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--border)", background: "var(--surface)",
        color: "var(--fg-muted)", transition: "color .15s, border-color .15s", flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
          <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0Zm0 13a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-1.042 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm9.193 9.193a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM16 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm10.657-5.657a.75.75 0 0 1 0 1.061l-1.061 1.06a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.06-1.061a.75.75 0 0 1 1.061 0ZM4.404 11.596a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
          <path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Z" />
        </svg>
      )}
    </button>
  );
}

function HeaderBtn({ onClick, icon, label, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        height: 34, padding: "0 13px", borderRadius: 8, cursor: "pointer",
        fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500,
        border: primary ? "1px solid var(--accent-emphasis)" : "1px solid var(--border)",
        background: primary ? "var(--accent)" : "var(--surface)",
        color: primary ? "var(--accent-fg)" : "var(--fg)",
        transition: "filter .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      {icon}
      {label}
    </button>
  );
}

function AchievementsSection({ items = [] }) {
  if (!items.length) return null;
  return (
    <Reveal>
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
            Badges unlocked
          </h2>
          <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>
            {items.length} EARNED
          </span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}>
          {items.map((b, i) => (
            <Reveal key={b.id} delay={i * 60} style={{
              padding: 16, display: "flex", alignItems: "center", gap: 13,
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
            }}>
              <span style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "var(--surface-2)", border: "1px solid var(--border-muted)",
                color: "var(--accent)", fontSize: 18,
              }}>
                {ACHIEVEMENT_ICONS[b.icon] || "🏆"}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>{b.label}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 2 }}>{b.note}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

const ACHIEVEMENT_ICONS = {
  trophy: "🏆", flame: "🔥", zap: "⚡", pr: "🔀", code: "👁️", globe: "🌐",
};

export default function Dashboard({ data, theme, onToggleTheme, onBack, onGenerateAgain }) {
  const [showShare, setShowShare] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [loadingHighlights, setLoadingHighlights] = useState(true);

  useEffect(() => {
    if (!data) return;
    generateHighlights(data)
      .then(setHighlights)
      .catch(() => setHighlights([]))
      .finally(() => setLoadingHighlights(false));
  }, [data]);

  if (!data) return null;

  const year = data.year || new Date().getFullYear();

  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", color: "var(--fg)" }}>

      {/* Sticky header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 20,
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 20px",
        background: "color-mix(in oklab, var(--canvas) 86%, transparent)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border-muted)",
      }}>
        <svg viewBox="0 0 16 16" width={22} height={22} fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>GitHub Wrapped</span>
        <span className="mono" style={{
          fontSize: 12, color: "var(--accent)",
          padding: "2px 7px", borderRadius: 6,
          background: "color-mix(in oklab, var(--accent) 14%, transparent)",
        }}>
          {year}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <HeaderBtn
            onClick={onBack}
            icon={
              <svg viewBox="0 0 16 16" width={14} height={14} fill="currentColor">
                <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06L4.81 7.25h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" />
              </svg>
            }
            label="Start over"
          />
          <HeaderBtn
            onClick={() => setShowShare(true)}
            icon={
              <svg viewBox="0 0 16 16" width={14} height={14} fill="currentColor">
                <path d="M3.75 6.5a.75.75 0 0 0-.75.75v6.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 12.25 16h-8.5A2.25 2.25 0 0 1 1.5 13.75v-6.5A2.25 2.25 0 0 1 3.75 5h2a.75.75 0 0 1 0 1.5ZM8 1a.75.75 0 0 1 .53.22l3 3a.75.75 0 0 1-1.06 1.06L8.75 3.56v6.69a.75.75 0 0 1-1.5 0V3.56L5.53 5.28a.75.75 0 0 1-1.06-1.06l3-3A.75.75 0 0 1 8 1Z" />
              </svg>
            }
            label="Share card"
            primary
          />
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: 1080, margin: "0 auto",
        padding: "28px 20px 64px",
        display: "flex", flexDirection: "column", gap: 26,
      }}>
        {data.rateLimit && <RateLimitBanner rateLimit={data.rateLimit} />}

        <HeroSection data={data} onGenerateAgain={onGenerateAgain} />

        <StatsRow data={data} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}>
          <TopLanguages languages={data.topLanguages} />
          <TopRepos repos={data.topRepos} />
        </div>

        <CommitActivity monthlyData={data.monthlyCommits} />

        {!loadingHighlights && highlights.length > 0 && (
          <HighlightsSection aiHighlights={highlights} />
        )}

        <AchievementsSection items={data.achievements} />

        {/* Share CTA */}
        <Reveal style={{
          display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "22px 24px",
        }}>
          <div style={{ flex: "1 1 240px" }}>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 4 }}>
              Show off the year.
            </div>
            <div style={{ fontSize: 13.5, color: "var(--fg-muted)" }}>
              Generate a poster-ready card built for your timeline.
            </div>
          </div>
          <HeaderBtn
            onClick={() => setShowShare(true)}
            icon={
              <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
                <path d="M3.75 6.5a.75.75 0 0 0-.75.75v6.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 12.25 16h-8.5A2.25 2.25 0 0 1 1.5 13.75v-6.5A2.25 2.25 0 0 1 3.75 5h2a.75.75 0 0 1 0 1.5ZM8 1a.75.75 0 0 1 .53.22l3 3a.75.75 0 0 1-1.06 1.06L8.75 3.56v6.69a.75.75 0 0 1-1.5 0V3.56L5.53 5.28a.75.75 0 0 1-1.06-1.06l3-3A.75.75 0 0 1 8 1Z" />
              </svg>
            }
            label="Generate share card"
            primary
          />
        </Reveal>

        <Footer year={year} />
      </div>

      {showShare && (
        <ShareCard data={data} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
