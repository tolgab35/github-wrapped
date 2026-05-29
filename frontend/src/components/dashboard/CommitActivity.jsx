import { useMemo } from "react";
import Reveal from "../Reveal";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US"));

export default function CommitActivity({ monthlyData = {} }) {
  const vals = MONTHS.map((m) => monthlyData[m] || 0);
  const max = Math.max(...vals, 1);
  const total = vals.reduce((a, b) => a + b, 0);

  const W = 760, H = 200, padL = 8, padR = 8, padT = 16, padB = 26;
  const iw = W - padL - padR, ih = H - padT - padB;

  const x = (i) => padL + (i / (vals.length - 1)) * iw;
  const y = (v) => padT + ih - (v / max) * ih;
  const pts = vals.map((v, i) => [x(i), y(v)]);

  const line = useMemo(() => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i];
      const mx = (px + cx) / 2;
      d += ` C ${mx} ${py}, ${mx} ${cy}, ${cx} ${cy}`;
    }
    return d;
  }, [JSON.stringify(monthlyData)]);

  const area = `${line} L ${x(vals.length - 1)} ${padT + ih} L ${x(0)} ${padT + ih} Z`;
  const peakIdx = vals.indexOf(max);

  return (
    <Reveal style={{
      padding: 22,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 8,
        flexWrap: "wrap", gap: 8,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
              Commit activity
            </h2>
          </div>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--fg-subtle)" }}>
            MONTH BY MONTH
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="tnum" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            {fmt(total)}
          </div>
          <div className="kicker">commits charted</div>
        </div>
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: "block", overflow: "visible" }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wr-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0.25, 0.5, 0.75].map((g, i) => (
          <line
            key={i}
            x1={padL} x2={W - padR}
            y1={padT + ih * g} y2={padT + ih * g}
            stroke="var(--grid-line)" strokeWidth={1}
          />
        ))}

        {/* Area fill */}
        <path
          d={area}
          fill="url(#wr-area)"
          style={{ opacity: 0, animation: "wr-fade .8s ease .4s forwards" }}
        />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: 2000,
            animation: "wr-draw 1.4s cubic-bezier(.16,1,.3,1) forwards",
          }}
        />

        {/* Peak dot */}
        <circle
          cx={x(peakIdx)} cy={y(max)}
          r={4}
          fill="var(--accent)"
          stroke="var(--canvas)"
          strokeWidth={2}
        />

        {/* Month labels — every other month */}
        {vals.map((_, i) =>
          i % 2 === 0 ? (
            <text
              key={i}
              x={x(i)} y={H - 6}
              fill="var(--fg-subtle)"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
            >
              {MONTHS[i]}
            </text>
          ) : null
        )}
      </svg>
    </Reveal>
  );
}
