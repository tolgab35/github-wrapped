import Reveal from "../Reveal";

export default function TopLanguages({ languages = [] }) {
  if (!languages.length) return null;

  return (
    <Reveal style={{
      padding: 22,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
          Top languages
        </h2>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>
          BY BYTES PUSHED
        </span>
      </div>

      {/* Stacked bar */}
      <div style={{
        display: "flex", height: 12, borderRadius: 999,
        overflow: "hidden", marginBottom: 20,
        background: "var(--surface-2)",
      }}>
        {languages.map((l, i) => (
          <div
            key={l.name}
            title={`${l.name} ${Math.round(l.percent)}%`}
            style={{
              width: `${l.percent}%`,
              background: l.color,
              transition: `width .9s cubic-bezier(.16,1,.3,1) ${i * 90}ms`,
            }}
          />
        ))}
      </div>

      {/* Language list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {languages.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{
              width: 11, height: 11, borderRadius: "50%",
              background: l.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: 13.5, fontWeight: 500 }}>{l.name}</span>
            <span className="mono tnum" style={{
              marginLeft: "auto", fontSize: 12.5, color: "var(--fg-muted)",
            }}>
              {Math.round(l.percent)}%
            </span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
