import { FiAlertTriangle, FiClock } from "react-icons/fi";

export default function RateLimitBanner({ rateLimit }) {
  if (!rateLimit) return null;

  const { remaining, limit, reset } = rateLimit;
  const percentage = (remaining / limit) * 100;
  const isLow = percentage < 20;
  const isCritical = percentage < 10;

  // Don't show if rate limit is healthy
  if (percentage > 50) return null;

  const resetDate = new Date(reset * 1000);
  const now = new Date();
  const minutesUntilReset = Math.round((resetDate - now) / 1000 / 60);

  return (
    <div
      className={`
        mb-6 p-4 rounded-xl border backdrop-blur-sm
        ${
          isCritical
            ? "bg-red-500/10 border-red-500/30"
            : isLow
            ? "bg-yellow-500/10 border-yellow-500/30"
            : "bg-blue-500/10 border-blue-500/30"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <FiAlertTriangle
          className={`
            text-xl mt-0.5
            ${
              isCritical
                ? "text-red-400"
                : isLow
                ? "text-yellow-400"
                : "text-blue-400"
            }
          `}
        />
        <div className="flex-1">
          <h3
            className={`
              font-semibold mb-1
              ${
                isCritical
                  ? "text-red-300"
                  : isLow
                  ? "text-yellow-300"
                  : "text-blue-300"
              }
            `}
          >
            {isCritical
              ? "Critical: GitHub API Rate Limit Low"
              : isLow
              ? "Warning: GitHub API Rate Limit Low"
              : "GitHub API Rate Limit Notice"}
          </h3>
          <p className="text-sm text-white/70 mb-3">
            {remaining} of {limit} API requests remaining (
            {percentage.toFixed(1)}%)
          </p>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className={`
                h-full rounded-full transition-all duration-500
                ${
                  isCritical
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : isLow
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }
              `}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-white/60">
            <FiClock className="text-sm" />
            <span>
              Resets in {minutesUntilReset} minute
              {minutesUntilReset !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
