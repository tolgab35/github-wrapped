export default function StatsRow({ data }) {
  const { totalCommits, totalPRs, totalIssues, totalContributions, growth } =
    data;

  const stats = [
    {
      label: "Total Commits",
      value: totalCommits,
      delta: growth?.commitsGrowth,
    },
    {
      label: "PRs Opened",
      value: totalPRs,
      delta: growth?.prsGrowth,
    },
    {
      label: "Issues Created",
      value: totalIssues,
      delta: growth?.issuesGrowth,
    },
    {
      label: "Total Contributions",
      value: totalContributions,
      delta: growth?.overallGrowth,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="
            bg-white/5 rounded-2xl px-4 py-3
            border border-white/10
            backdrop-blur-lg
            shadow-[0_0_25px_rgba(15,23,42,0.8)]
            hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(120,80,255,0.5)]
            transition
          "
        >
          <div className="text-[11px] text-white/60 mb-1">{item.label}</div>
          <div className="text-xl font-semibold mb-1">{item.value}</div>
          {typeof item.delta === "number" && (
            <div
              className={`text-[11px] ${
                item.delta >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {item.delta >= 0 ? "+" : ""}
              {item.delta}% vs 2024
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
