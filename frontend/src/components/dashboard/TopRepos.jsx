import Reveal from "../Reveal";

const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US"));

export default function TopRepos({ repos = [] }) {
  if (!repos.length) return null;
  const max = Math.max(...repos.map((r) => r.contributions));

  return (
    <Reveal style={{
      padding: 22,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
          Top repositories
        </h2>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>
          WHERE YOU LIVED
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {repos.map((r, i) => (
          <div key={r.name}>
            {/* Repo name row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span className="mono" style={{
                color: "var(--fg-subtle)", flexShrink: 0, width: 18,
                textAlign: "center", fontSize: 12,
              }}>
                #{i + 1}
              </span>
              <svg viewBox="0 0 16 16" width={14} height={14} fill="var(--fg-muted)" style={{ flexShrink: 0 }}>
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
              </svg>
              <span className="mono" style={{
                fontSize: 13, color: "var(--fg)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {r.name}
              </span>
              {r.stars > 0 && (
                <span style={{
                  marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4,
                  color: "var(--fg-subtle)", fontFamily: "var(--font-mono)", fontSize: 11.5,
                  flexShrink: 0,
                }}>
                  <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                  </svg>
                  {fmt(r.stars)}
                </span>
              )}
            </div>

            {/* Bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 26 }}>
              <div style={{
                flex: 1, height: 6, borderRadius: 999,
                background: "var(--surface-2)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 999, background: "var(--accent)",
                  width: `${(r.contributions / max) * 100}%`,
                  transition: `width 1s cubic-bezier(.16,1,.3,1) ${i * 80}ms`,
                }} />
              </div>
              <span className="mono tnum" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11.5, color: "var(--fg-muted)",
                width: 74, justifyContent: "flex-end", flexShrink: 0,
              }}>
                <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor">
                  <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
                </svg>
                {fmt(r.contributions)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
