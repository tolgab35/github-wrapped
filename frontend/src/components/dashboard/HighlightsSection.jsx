export default function HighlightsSection({ aiHighlights = [] }) {
  return (
    <section className="mt-10 w-full max-w-6xl mx-auto">
      <div className="rounded-3xl p-[2px] bg-gradient-to-r from-purple-500/40 via-blue-500/30 to-indigo-500/40 shadow-[0_0_35px_rgba(80,80,255,0.3)]">
        <div className="bg-[#0f1020]/80 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-8">
            <span className="text-2xl">🏆</span> Your Yearly Highlights
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {aiHighlights.map((item, index) => (
              <div
                key={`ai-${index}`}
                className="bg-[#1b1c33]/70 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(60,60,150,0.25)] border border-white/5"
              >
                <div className="mb-4 text-4xl">{item.emoji}</div>

                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
