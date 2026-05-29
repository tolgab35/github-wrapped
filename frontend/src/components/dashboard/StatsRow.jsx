import useCountUp from "../../hooks/useCountUp";
import Reveal from "../Reveal";

const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US"));

function Delta({ value }) {
  if (value == null) return null;
  const up = value >= 0;
  return (
    <span className="mono tnum" style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      fontSize: 11, fontWeight: 500,
      color: up ? "var(--accent)" : "#f85149",
    }}>
      {up ? "↑" : "↓"}{Math.abs(value)}%
    </span>
  );
}

const ICONS = {
  commit: (
    <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
      <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
    </svg>
  ),
  pr: (
    <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
      <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
    </svg>
  ),
  issue: (
    <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
    </svg>
  ),
  review: (
    <svg viewBox="0 0 16 16" width={15} height={15} fill="currentColor">
      <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06Zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06Z" />
    </svg>
  ),
};

function StatTile({ icon, label, value, delta, delay }) {
  const animated = useCountUp(value ?? 0, { duration: 1300 });

  return (
    <Reveal delay={delay} style={{
      padding: 18,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 14,
      }}>
        <span style={{
          display: "inline-flex", width: 30, height: 30, borderRadius: 8,
          alignItems: "center", justifyContent: "center",
          background: "var(--surface-2)", border: "1px solid var(--border-muted)",
          color: "var(--fg-muted)",
        }}>
          {icon}
        </span>
        <Delta value={delta} />
      </div>
      <div className="tnum" style={{
        fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1,
      }}>
        {fmt(animated)}
      </div>
      <div className="kicker" style={{ marginTop: 4 }}>{label}</div>
    </Reveal>
  );
}

export default function StatsRow({ data }) {
  const growth = data.growth;

  const tiles = [
    { icon: ICONS.commit, label: "Commits",      value: data.totalCommits,  delta: growth?.commits },
    { icon: ICONS.pr,     label: "Pull Requests", value: data.totalPRs,      delta: growth?.prs },
    { icon: ICONS.issue,  label: "Issues",        value: data.totalIssues,   delta: growth?.issues },
    { icon: ICONS.review, label: "Reviews",       value: data.totalReviews,  delta: null },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 14,
    }}>
      {tiles.map((t, i) => (
        <StatTile key={t.label} {...t} delay={i * 70} />
      ))}
    </div>
  );
}
