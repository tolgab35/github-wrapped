import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ContribGraph from "../ContribGraph";
import Identicon from "../Identicon";

const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US"));

function Stat({ label, value }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="kicker" style={{ fontSize: 9.5, marginBottom: 4, color: "rgba(255,255,255,0.5)" }}>
        {label}
      </div>
      <div className="tnum" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent)" }}>
        {value}
      </div>
    </div>
  );
}

function ShareCardOverlay({ data, onClose }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const topLang = data.topLanguages?.[0];
  const topRepo = data.topRepos?.[0];
  const user = data.user || { login: data.login, name: data.name, identiconSeed: data.login };

  const handleDownload = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(1,4,9,0.74)", backdropFilter: "blur(6px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 24, gap: 18, overflowY: "auto",
      }}
      className="fade"
    >
      {/* Poster card — forced dark regardless of theme */}
      <div
        onClick={(e) => e.stopPropagation()}
        data-theme="dark"
        style={{
          width: "min(400px, 92vw)", borderRadius: 20, overflow: "hidden",
          background: "linear-gradient(180deg, #0d1117 0%, #010409 100%)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
          animation: "wr-pop .5s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Header strip */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "18px 22px", borderBottom: "1px solid var(--border-muted)",
        }}>
          <svg viewBox="0 0 16 16" width={18} height={18} fill="#fff">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 13, color: "#fff" }}>GitHub Wrapped</span>
          <span className="mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--accent)" }}>
            {data.year || new Date().getFullYear()}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 22px 26px", color: "#fff" }}>
          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            {data.user?.avatarUrl ? (
              <img
                src={data.user.avatarUrl}
                alt={user.login}
                style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border-muted)" }}
              />
            ) : (
              <Identicon seed={user.identiconSeed || user.login} size={40} />
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name || user.login}</div>
              <div className="mono" style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                @{user.login}
              </div>
            </div>
          </div>

          {/* Big number */}
          <div className="kicker" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
            Total contributions
          </div>
          <div className="tnum" style={{
            fontSize: 62, fontWeight: 700, letterSpacing: "-0.05em",
            lineHeight: 0.9, color: "var(--accent)", marginBottom: 18,
          }}>
            {fmt(data.totalContributions)}
          </div>

          {/* Compact contribution graph */}
          <div style={{ marginBottom: 20 }}>
            <ContribGraph
              weeks={data.grid || []}
              animate={false}
              cell={5} gap={1.6} radius={1}
              showMonths={false} showLegend={false} compact={true}
            />
          </div>

          {/* Stat row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <Stat label="Commits" value={fmt(data.totalCommits)} />
            <Stat label="Streak" value={`${data.longestStreak ?? data.streak ?? 0}d`} />
            <Stat label="Reviews" value={fmt(data.totalReviews)} />
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", gap: 12 }}>
            {topLang && (
              <div style={{
                flex: 1, padding: "12px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-muted)",
              }}>
                <div className="kicker" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>
                  Top language
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: topLang.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{topLang.name}</span>
                </div>
              </div>
            )}
            {topRepo && (
              <div style={{
                flex: 1, padding: "12px 14px", borderRadius: 10,
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-muted)",
              }}>
                <div className="kicker" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>
                  Top repo
                </div>
                <div className="mono" style={{
                  fontSize: 12.5, fontWeight: 600,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {topRepo.name}
                </div>
              </div>
            )}
          </div>

          <div className="mono" style={{
            marginTop: 22, fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center",
          }}>
            github-wrapped · {data.year || new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleDownload}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 42, padding: "0 18px", borderRadius: 10,
            border: "1px solid var(--accent-emphasis)", background: "var(--accent)",
            color: "var(--accent-fg)", fontFamily: "var(--font-display)",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
            {saved
              ? <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L1.97 9.03a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
              : <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Zm5.25-3a.75.75 0 0 1-.53-.22l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V1.75a.75.75 0 0 1 1.5 0v6.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3A.75.75 0 0 1 8 11Z" />
            }
          </svg>
          {saved ? "Saved!" : "Download PNG"}
        </button>
        <button
          onClick={onClose}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 42, padding: "0 18px", borderRadius: 10,
            border: "1px solid var(--border)", background: "var(--surface)",
            color: "var(--fg)", fontFamily: "var(--font-display)",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

export default ShareCardOverlay;
