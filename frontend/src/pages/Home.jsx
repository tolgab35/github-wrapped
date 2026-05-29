import { useState } from "react";

const EXAMPLES = ["torvalds", "gaearon", "tolgab35"];

// Deterministic decorative backdrop grid
function BackdropGrid() {
  const cols = 38, rows = 9, cell = 13, gap = 4, step = 17;
  const cells = [];
  let h = 99173;
  const next = () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
  const ramp = ["var(--cell-empty)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const r = next();
      const lvl = r < 0.55 ? 0 : r < 0.72 ? 1 : r < 0.85 ? 2 : r < 0.94 ? 3 : 4;
      cells.push({ x, y, fill: ramp[lvl] });
    }
  }

  return (
    <svg
      width={cols * step}
      height={rows * step}
      aria-hidden="true"
      style={{
        position: "absolute", right: -40, bottom: -20,
        opacity: 0.5,
        maskImage: "radial-gradient(120% 120% at 100% 100%, #000 30%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(120% 120% at 100% 100%, #000 30%, transparent 72%)",
        pointerEvents: "none",
      }}
    >
      {cells.map(({ x, y, fill }) => (
        <rect
          key={`${x}-${y}`}
          x={x * step} y={y * step}
          width={cell} height={cell}
          rx={2.5}
          fill={fill}
        />
      ))}
    </svg>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: 34, height: 34, borderRadius: 8, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        border: "1px solid var(--border)", background: "var(--surface)",
        color: "var(--fg-muted)", transition: "color .15s, border-color .15s",
        flexShrink: 0,
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

export default function Home({ onGenerate, error, theme, onToggleTheme }) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const clean = value.trim().replace(/^@/, "");
    if (clean) onGenerate(clean);
    else setTouched(true);
  };

  const inputBorder = touched && !value.trim() ? "var(--accent)" : "var(--border)";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "var(--canvas)", color: "var(--fg)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "20px 24px", borderBottom: "1px solid var(--border-muted)",
      }}>
        <svg viewBox="0 0 16 16" width={22} height={22} fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>GitHub Wrapped</span>
        <span className="mono" style={{ marginLeft: "auto", marginRight: 12, fontSize: 12, color: "var(--fg-muted)" }}>
          EST. 2008 · GIT GUD
        </span>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      {/* Center */}
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px", textAlign: "center",
        position: "relative", zIndex: 2,
      }}>
        <BackdropGrid />

        <div className="fade" style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 460 }}>
          {/* Kicker badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 22,
            padding: "5px 12px", borderRadius: 999,
            border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg-muted)",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "var(--accent)",
              boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)",
            }} />
            <span className="mono" style={{ fontSize: 12 }}>{new Date().getFullYear()} year in review</span>
          </div>

          <h1 style={{
            fontSize: "clamp(34px, 6vw, 52px)", lineHeight: 1.04,
            letterSpacing: "-0.03em", fontWeight: 700, margin: "0 0 16px",
          }}>
            Your year in code,
            <br />
            <span style={{ color: "var(--accent)" }}>one grid at a time.</span>
          </h1>

          <p style={{
            color: "var(--fg-muted)", fontSize: 16, lineHeight: 1.55,
            margin: "0 auto 32px", maxWidth: 380,
          }}>
            Every commit, pull request, and 2 a.m. hotfix — recapped.
            Drop a username to unwrap the year.
          </p>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 16, padding: "12px 16px", borderRadius: 10,
              background: "color-mix(in oklab, #f85149 12%, transparent)",
              border: "1px solid color-mix(in oklab, #f85149 35%, transparent)",
              color: "#f85149", fontSize: 13.5, textAlign: "left",
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
              display: "flex", alignItems: "center",
              background: "var(--surface)", border: `1px solid ${inputBorder}`,
              borderRadius: 10, overflow: "hidden", height: 52,
              transition: "border-color .2s",
            }}>
              <span className="mono" style={{ padding: "0 4px 0 16px", color: "var(--fg-subtle)", fontSize: 16, userSelect: "none" }}>
                @
              </span>
              <input
                value={value}
                autoFocus
                spellCheck={false}
                autoCapitalize="none"
                onChange={(e) => setValue(e.target.value)}
                placeholder="username"
                aria-label="GitHub username"
                style={{
                  flex: 1, height: "100%", border: "none", outline: "none",
                  background: "transparent", color: "var(--fg)",
                  fontFamily: "var(--font-mono)", fontSize: 16, padding: "0 12px 0 0",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                height: 50, borderRadius: 10,
                border: "1px solid var(--accent-emphasis)",
                background: "var(--accent)", color: "var(--accent-fg)",
                fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "filter .15s, transform .05s",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
            >
              <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
                <path d="M9.504.43a1.516 1.516 0 0 1 2.437 1.713L10.415 5.5h2.123c1.57 0 2.346 1.909 1.22 3.004l-7.34 7.142a1.249 1.249 0 0 1-.871.354h-.302a1.25 1.25 0 0 1-1.157-1.723L5.633 10.5H3.462c-1.57 0-2.346-1.909-1.22-3.004L9.503.429Z" />
              </svg>
              Unwrap my year
            </button>
          </form>

          {/* Example usernames */}
          <div className="mono" style={{
            marginTop: 18, fontSize: 11.5, color: "var(--fg-subtle)",
            display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap",
          }}>
            <span>Try</span>
            {EXAMPLES.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onGenerate(u)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border-muted)",
                  color: "var(--fg-muted)", borderRadius: 6, padding: "3px 8px",
                  fontFamily: "var(--font-mono)", fontSize: 11.5, cursor: "pointer",
                  transition: "border-color .15s, color .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--fg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-muted)"; e.currentTarget.style.color = "var(--fg-muted)"; }}
              >
                @{u}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
