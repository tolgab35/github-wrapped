import { useState, useEffect, useRef } from "react";

const STAGES = [
  "Cloning your year…",
  "Counting contributions…",
  "Untangling merge conflicts…",
  "Ranking your repositories…",
  "Rendering the grid…",
];

const RAMP = ["var(--cell-empty)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const COLS = 14, ROWS = 7, CELL = 16, GAP = 5, STEP = 21;

export default function LoadingScreen({ username = "" }) {
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);
  const [lit, setLit] = useState(() => new Array(COLS * ROWS).fill(0));
  const litRef = useRef(lit);
  litRef.current = lit;

  useEffect(() => {
    const total = COLS * ROWS;
    const order = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
    let i = 0;

    const fill = setInterval(() => {
      if (i >= order.length) { clearInterval(fill); return; }
      const batch = order.slice(i, i + 5);
      setLit((prev) => {
        const n = prev.slice();
        batch.forEach((idx) => (n[idx] = [1, 2, 3, 4][Math.floor(Math.random() * 4)]));
        return n;
      });
      i += 5;
    }, 26);

    const DURATION = 2600;
    const t0 = performance.now();
    const prog = setInterval(() => {
      const p = Math.min(100, ((performance.now() - t0) / DURATION) * 100);
      setPct(p);
      setStage(Math.min(STAGES.length - 1, Math.floor((p / 100) * STAGES.length)));
      if (p >= 100) clearInterval(prog);
    }, 40);

    return () => { clearInterval(fill); clearInterval(prog); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "var(--canvas)", color: "var(--fg)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 30, padding: 24,
    }}>
      {/* Animated contribution mini-grid */}
      <svg
        width={COLS * STEP - GAP}
        height={ROWS * STEP - GAP}
        style={{ maxWidth: "100%" }}
      >
        {lit.map((lvl, idx) => {
          const x = Math.floor(idx / ROWS);
          const y = idx % ROWS;
          return (
            <rect
              key={idx}
              x={x * STEP} y={y * STEP}
              width={CELL} height={CELL}
              rx={3}
              fill={RAMP[lvl]}
              stroke="var(--cell-border)"
              strokeWidth={1}
              style={{ transition: "fill .3s ease" }}
            />
          );
        })}
      </svg>

      {/* Progress info */}
      <div style={{ width: "min(360px, 80vw)", textAlign: "center" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: 10,
        }}>
          <span className="mono" style={{ fontSize: 13, color: "var(--fg)" }}>
            {username ? `@${username}` : "Loading…"}
          </span>
          <span className="mono tnum" style={{ fontSize: 13, color: "var(--accent)" }}>
            {Math.floor(pct)}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 6, borderRadius: 999,
          background: "var(--surface-2)", overflow: "hidden",
          border: "1px solid var(--border-muted)",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "var(--accent)", borderRadius: 999,
            transition: "width .12s linear",
          }} />
        </div>

        {/* Stage label */}
        <div className="mono" style={{
          marginTop: 14, fontSize: 12.5, color: "var(--fg-muted)",
          display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
        }}>
          <span style={{
            width: 12, height: 12, borderRadius: "50%",
            border: "2px solid var(--border)", borderTopColor: "var(--accent)",
            display: "inline-block", animation: "wr-spin .7s linear infinite",
          }} />
          {STAGES[stage]}
        </div>
      </div>
    </div>
  );
}
