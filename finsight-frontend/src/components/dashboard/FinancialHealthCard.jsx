import { HeartPulse, ShieldCheck, TriangleAlert } from "lucide-react";

/*
 * FinancialHealthCard
 * -------------------
 * Visual representation of the user's
 * overall financial condition.
 *
 * The score can later be calculated by the
 * dashboard/analytics logic.
 */
function FinancialHealthCard({
  score = 0,
  label = "Getting Started",
  description = "Add more financial activity to build your health score.",
}) {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));

  const getScoreStyle = () => {
    if (safeScore >= 75) {
      return {
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        icon: ShieldCheck,
      };
    }

    if (safeScore >= 50) {
      return {
        text: "text-blue-600",
        bg: "bg-blue-50",
        icon: HeartPulse,
      };
    }

    return {
      text: "text-amber-600",
      bg: "bg-amber-50",
      icon: TriangleAlert,
    };
  };

  const scoreStyle = getScoreStyle();
  const ScoreIcon = scoreStyle.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Financial Health
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {label}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${scoreStyle.bg} ${scoreStyle.text}`}
        >
          <ScoreIcon size={20} strokeWidth={1.8} />
        </div>
      </div>

      {/* Score */}
      <div className="mt-6 flex items-center gap-5">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#2563eb ${safeScore * 3.6}deg, #e2e8f0 0deg)`,
            }}
          />

          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-slate-900">
              {safeScore}
            </span>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FinancialHealthCard;
