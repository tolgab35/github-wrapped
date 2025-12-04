export default function TopRepos({ repos }) {
  const cardClass = `
    bg-white/5 border border-white/10 backdrop-blur-xl
    rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.25)]
  `;

  // Top 3 repos
  const topRepos = repos.slice(0, 3);

  // Find the highest contribution count
  const maxContributions = Math.max(...topRepos.map((r) => r.contributions));

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-white mb-4">
        Top Repositories
      </h3>

      {topRepos.map((repo) => {
        // Percentage ratio
        const percent = (repo.contributions / maxContributions) * 100;

        return (
          <div key={repo.name} className="mb-6">
            <div className="flex justify-between text-sm text-white/80 mb-1">
              <span>{repo.name}</span>
              <span>{repo.contributions} commits</span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="
                  h-full rounded-full 
                  bg-gradient-to-r from-purple-400 to-blue-500
                "
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
