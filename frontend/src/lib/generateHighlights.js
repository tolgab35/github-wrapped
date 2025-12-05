function buildFallbackHighlights(stats) {
  const topLang = stats.topLanguages?.[0]?.name || "your top language";
  const topRepo = stats.topRepos?.[0]?.name || "your repo";
  const bestDay = stats.bestDay || "your best day";
  const streak = stats.streak || 0;

  return [
    {
      emoji: "🌙",
      title: "Night Owl",
      description: `Most commits on ${bestDay}, clearly late-night coding is your thing.`,
    },
    {
      emoji: "🔥",
      title: "Streak Runner",
      description: `Kept a ${streak}-day commit streak alive. Respect.`,
    },
    {
      emoji: "⭐",
      title: "Top Repo Hero",
      description: `You spent most of your energy on ${topRepo} with ${topLang} leading the way.`,
    },
  ];
}

export async function generateHighlights(stats) {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/api/highlights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stats),
    });

    if (!res.ok) {
      throw new Error("Highlights API error");
    }

    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }

    return buildFallbackHighlights(stats);
  } catch (err) {
    console.error("Frontend generateHighlights error:", err);
    return buildFallbackHighlights(stats);
  }
}

export default generateHighlights;
