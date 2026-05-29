import useCountUp from "../../hooks/useCountUp";
import ContribGraph from "../ContribGraph";
import Identicon from "../Identicon";
import Reveal from "../Reveal";

const fmt = (n) => (n == null ? "—" : n.toLocaleString("en-US"));

function Delta({ value }) {
  if (value == null) return null;
  const up = value >= 0;
  return (
    <span className="mono tnum" style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 11.5, fontWeight: 500,
      color: up ? "var(--accent)" : "#f85149",
      marginLeft: 8,
    }}>
      {up ? "↑" : "↓"}{Math.abs(value)}%
    </span>
  );
}

function MiniStat({ label, value, sub, wide }) {
  return (
    <div style={{ flex: wide ? "1 1 100%" : "1 1 120px", minWidth: 120 }}>
      <div className="kicker" style={{ marginBottom: 6 }}>{label}</div>
      <div className="tnum" style={{
        fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-subtle)", marginTop: 4 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function HeroSection({ data, onGenerateAgain }) {
  const user = data.user || { login: data.login, name: data.name, avatarUrl: data.avatarUrl, identiconSeed: data.login };
  const total = useCountUp(data.totalContributions ?? 0, { duration: 1700 });
  const growth = data.growth;
  const year = data.year || new Date().getFullYear();

  return (
    <section className="fade" style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 16, padding: "26px 26px 22px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Identity row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.login}
            style={{
              width: 50, height: 50, borderRadius: "50%",
              border: "1px solid var(--border-muted)",
              flexShrink: 0,
            }}
          />
        ) : (
          <Identicon seed={user.identiconSeed || user.login} size={50} />
        )}
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {user.name || user.login}
          </div>
          <div className="mono" style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>
            @{user.login}
          </div>
        </div>
        <div className="mono" style={{
          marginLeft: "auto", fontSize: 11.5, color: "var(--fg-subtle)",
          textAlign: "right", lineHeight: 1.6,
        }}>
          {user.joined ? `joined ${user.joined}` : ""}
          {user.joined && user.followers != null ? <br /> : ""}
          {user.followers != null ? `${fmt(user.followers)} followers` : ""}
        </div>
      </div>

      {/* Big contribution count */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: "clamp(15px,2.4vw,18px)", color: "var(--fg-muted)", marginBottom: 6 }}>
          In {year}, {(user.name || user.login).split(" ")[0]} made
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span className="tnum" style={{
            fontSize: "clamp(54px,11vw,96px)", fontWeight: 700,
            letterSpacing: "-0.05em", lineHeight: 0.9, color: "var(--accent)",
          }}>
            {fmt(total)}
          </span>
          <span style={{ fontSize: "clamp(18px,2.6vw,22px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
            contributions
            <Delta value={growth?.contributions} />
            <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-subtle)", marginLeft: 6 }}>
              vs {year - 1}
            </span>
          </span>
        </div>
      </div>

      {/* Mini stats row */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 18,
        paddingBottom: 22, marginBottom: 22,
        borderBottom: "1px solid var(--border-muted)",
      }}>
        <MiniStat
          label="Longest streak"
          value={`${data.longestStreak ?? data.streak ?? 0} days`}
        />
        <MiniStat
          label="Active days"
          value={data.activeDays ?? "—"}
          sub="of 365"
        />
        <MiniStat
          label="Busiest day"
          value={data.busiestDay?.count ?? "—"}
          sub={data.busiestDay?.label}
        />
        <MiniStat
          label="Reviews given"
          value={fmt(data.totalReviews ?? 0)}
          sub="team unblocker"
        />
      </div>

      {/* Contribution graph */}
      <div style={{ width: "100%", paddingBottom: 2 }}>
        <ContribGraph
          weeks={data.grid || []}
          animate={true}
          cell={13}
          gap={3}
          fill={true}
        />
      </div>

      {/* Generate again */}
      {onGenerateAgain && (
        <div style={{ marginTop: 18 }}>
          <button
            onClick={onGenerateAgain}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              height: 34, padding: "0 13px", borderRadius: 8, cursor: "pointer",
              fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500,
              border: "1px solid var(--border)", background: "var(--surface)",
              color: "var(--fg)", transition: "filter .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            <svg viewBox="0 0 16 16" width={13} height={13} fill="currentColor">
              <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z" />
            </svg>
            Generate again
          </button>
        </div>
      )}
    </section>
  );
}
