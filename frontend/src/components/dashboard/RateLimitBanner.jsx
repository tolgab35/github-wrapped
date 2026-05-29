export default function RateLimitBanner({ rateLimit }) {
  if (!rateLimit) return null;

  const { remaining, limit, reset } = rateLimit;
  const pct = (remaining / limit) * 100;
  if (pct > 50) return null;

  const isCritical = pct < 10;
  const resetDate = new Date(reset * 1000);
  const mins = Math.max(0, Math.round((resetDate - Date.now()) / 60000));

  const color = isCritical ? "#f85149" : "#d29922";

  return (
    <div style={{
      marginBottom: 20, padding: "12px 16px", borderRadius: 10,
      background: `color-mix(in oklab, ${color} 10%, transparent)`,
      border: `1px solid color-mix(in oklab, ${color} 30%, transparent)`,
      display: "flex", alignItems: "flex-start", gap: 12,
    }}>
      <svg viewBox="0 0 16 16" width={16} height={16} fill={color} style={{ marginTop: 1, flexShrink: 0 }}>
        <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 4 }}>
          {isCritical ? "Critical: GitHub API rate limit low" : "GitHub API rate limit notice"}
        </div>
        <div className="mono" style={{ fontSize: 12, color: "var(--fg-muted)" }}>
          {remaining} / {limit} requests remaining · resets in {mins}m
        </div>
        <div style={{
          marginTop: 8, height: 4, borderRadius: 999,
          background: "var(--surface-2)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`, borderRadius: 999, background: color,
            transition: "width .3s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
