import Reveal from "../Reveal";

const ICON_MAP = {
  "🔥": "flame", "⭐": "star", "📌": "pin", "🏆": "trophy",
  "🚀": "rocket", "💡": "bulb", "🎯": "target",
};

export default function HighlightsSection({ aiHighlights = [] }) {
  if (!aiHighlights.length) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
          Moments that defined the year
        </h2>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>
          AI-DETECTED
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 14,
      }}>
        {aiHighlights.map((h, i) => (
          <Reveal key={i} delay={i * 90} style={{
            padding: 22,
            display: "flex", flexDirection: "column", gap: 12,
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
          }}>
            {/* Icon badge */}
            <span style={{
              width: 38, height: 38, borderRadius: 10,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "color-mix(in oklab, var(--accent) 16%, transparent)",
              border: "1px solid color-mix(in oklab, var(--accent) 30%, transparent)",
              fontSize: 18,
            }}>
              {h.emoji || "✨"}
            </span>

            <h3 style={{
              fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-0.01em",
            }}>
              {h.title}
            </h3>

            <p style={{
              fontSize: 13.5, lineHeight: 1.55,
              color: "var(--fg-muted)", margin: 0,
            }}>
              {h.description}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
