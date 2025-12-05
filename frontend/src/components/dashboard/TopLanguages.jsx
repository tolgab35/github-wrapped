export default function TopLanguages({ languages }) {
  const cardClass = `
    bg-white/5 rounded-2xl p-6 
    border border-white/10
    backdrop-blur-lg
    shadow-[0_0_25px_rgba(15,23,42,0.8)]
    hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(120,80,255,0.5)]
    transition
  `;

  return (
    <div className={cardClass}>
      <h3 className="text-lg font-semibold text-white mb-1">Top Languages</h3>
      <h2 className="text-2xl font-bold mb-4">{languages[0].name}</h2>

      {languages.map((lang) => {
        const faded = lang.color + "55";

        return (
          <div key={lang.name} className="mb-4">
            <div className="flex justify-between text-sm text-white/70 mb-1">
              <span>{lang.name}</span>
              <span>{Math.round(lang.percent)}%</span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${lang.percent}%`,
                  background: `linear-gradient(to right, ${lang.color}, ${faded})`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
