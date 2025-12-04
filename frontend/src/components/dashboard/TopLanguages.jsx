export default function TopLanguages({ languages }) {
  const cardClass = `
    bg-white/5 border border-white/10 backdrop-blur-xl
    rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.25)]
  `;

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-white mb-1">Top Languages</h3>
      <h2 className="text-2xl font-bold mb-4">{languages[0].name}</h2>

      {languages.map((lang) => (
        <div key={lang.name} className="mb-4">
          <div className="flex justify-between text-sm text-white/70 mb-1">
            <span>{lang.name}</span>
            <span>{Math.round(lang.percent)}%</span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
              style={{ width: `${lang.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
