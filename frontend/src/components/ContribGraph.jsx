import { useMemo } from "react";

const LEVEL_VARS = ["var(--cell-empty)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = { 1: "Mon", 3: "Wed", 5: "Fri" };

export default function ContribGraph({
  weeks = [],
  cell = 12,
  gap = 3,
  radius = 2.5,
  animate = true,
  showMonths = true,
  showLegend = true,
  compact = false,
  fill = true,
}) {
  const monthLabels = useMemo(() => {
    const out = [];
    const total = weeks.length;
    for (let w = 0; w < total; w++) {
      const m = Math.min(11, Math.floor((w / total) * 12));
      if (!out.length || out[out.length - 1].m !== m) out.push({ m, w });
    }
    return out;
  }, [weeks.length]);

  const step = cell + gap;
  const showDays = !compact;
  const leftPad = showDays ? cell * 2 + 8 : 0;
  const topPad = showMonths ? cell + 5 : 0;
  const gridW = weeks.length * step - gap;
  const gridH = 7 * step - gap;
  const totalW = leftPad + gridW;
  const totalH = topPad + gridH;
  const labelFont = Math.max(8, cell * 0.78);

  const svgProps = fill
    ? { width: "100%", style: { display: "block", height: "auto" } }
    : { width: totalW, height: totalH, style: { display: "block", maxWidth: "100%", height: "auto" } };

  if (!weeks.length) return null;

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        role="img"
        aria-label="Contribution graph"
        preserveAspectRatio="xMinYMin meet"
        {...svgProps}
      >
        {showMonths && monthLabels.map((ml, i) => (
          <text
            key={"m" + i}
            x={leftPad + ml.w * step}
            y={topPad - 6}
            fill="var(--fg-subtle)"
            style={{ fontFamily: "var(--font-mono)", fontSize: labelFont }}
          >
            {MONTHS[ml.m]}
          </text>
        ))}

        {showDays && Object.entries(DAY_LABELS).map(([di, label]) => (
          <text
            key={"d" + di}
            x={leftPad - 8}
            y={topPad + Number(di) * step + cell * 0.82}
            fill="var(--fg-subtle)"
            textAnchor="end"
            style={{ fontFamily: "var(--font-mono)", fontSize: labelFont }}
          >
            {label}
          </text>
        ))}

        {weeks.map((week, wi) =>
          week.map((lvl, di) => {
            const delay = animate ? (wi * 7 + di) * 1.6 : 0;
            return (
              <rect
                key={`${wi}-${di}`}
                x={leftPad + wi * step}
                y={topPad + di * step}
                width={cell}
                height={cell}
                rx={radius}
                ry={radius}
                fill={LEVEL_VARS[lvl] ?? LEVEL_VARS[0]}
                stroke="var(--cell-border)"
                strokeWidth={1}
                style={animate ? { opacity: 0, animation: `wr-cell-in 0.42s ease ${delay}ms forwards` } : undefined}
              />
            );
          })
        )}
      </svg>

      {showLegend && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end",
          marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-subtle)",
        }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              style={{
                width: 11, height: 11, borderRadius: 2.5,
                background: LEVEL_VARS[l],
                border: "1px solid var(--cell-border)",
                display: "inline-block",
              }}
            />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}
