export default function Footer({ year }) {
  return (
    <div className="mono" style={{
      textAlign: "center", fontSize: 11.5, color: "var(--fg-subtle)", paddingTop: 8,
    }}>
      GitHub Wrapped · {year || new Date().getFullYear()} · a year-in-review ·{" "}
      <a
        href="https://github.com/tolgab35"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--accent)", textDecoration: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        tolgab35
      </a>
    </div>
  );
}
