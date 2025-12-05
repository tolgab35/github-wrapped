import { FileText, GitPullRequest, AlertCircle, Sparkles } from "lucide-react";

export default function StatsRow({ data }) {
  const { totalCommits, totalPRs, totalIssues, totalContributions, growth } =
    data;

  const stats = [
    {
      label: "Total Commits",
      icon: FileText,
      value: totalCommits,
      delta: growth?.commitsGrowth,
    },
    {
      label: "PRs Opened",
      icon: GitPullRequest,
      value: totalPRs,
      delta: growth?.prsGrowth,
    },
    {
      label: "Issues Created",
      icon: AlertCircle,
      value: totalIssues,
      delta: growth?.issuesGrowth,
    },
    {
      label: "Total Contributions",
      icon: Sparkles,
      value: totalContributions,
      delta: growth?.overallGrowth,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="
              bg-white/5 rounded-2xl px-6 py-6
              border border-white/10
              backdrop-blur-xl
              shadow-[0_0_25px_rgba(15,23,42,0.6)]
              hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(120,80,255,0.5)]
              transition
              flex flex-col items-center text-center
            "
          >
            <Icon
              size={32}
              className="text-purple-300 mb-3 drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]"
            />

            <div className="text-xs font-medium text-white/60 mb-1">
              {item.label}
            </div>

            <div className="text-3xl font-bold mb-1">{item.value}</div>

            {typeof item.delta === "number" && (
              <div
                className={`text-xs ${
                  item.delta >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.delta >= 0 ? "+" : ""}
                {item.delta}% vs 2024
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
