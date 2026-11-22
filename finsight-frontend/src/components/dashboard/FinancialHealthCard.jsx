import { HeartPulse, ShieldCheck, TriangleAlert } from "lucide-react";

/*
 * FinancialHealthCard
 * -------------------
 * Visual representation of the user's overall financial condition.
 */
function FinancialHealthCard({ score = 0, label = "Getting Started", description = "Add more financial activity to build your health score." }) {
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));

  const getScoreStyle = () => {
    if (safeScore >= 75) {
      return { text: "text-[var(--success)]", icon: ShieldCheck, ring: "ring-[var(--success)]/30" };
    }
    if (safeScore >= 50) {
      return { text: "text-[var(--info)]", icon: HeartPulse, ring: "ring-[var(--info)]/30" };
    }
    return { text: "text-[var(--warning)]", icon: TriangleAlert, ring: "ring-[var(--warning)]/30" };
  };

  const scoreStyle = getScoreStyle();
  const ScoreIcon = scoreStyle.icon;

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Financial Health</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-[var(--text-primary)]">{label}</h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl ${scoreStyle.ring} bg-[color-mix(in_srgb,var(--accent),transparent_92%)]">
          <ScoreIcon size={20} strokeWidth={1.8} className="text-[var(--accent)]" />
        </div>
      </div>

      <div className="mt-7 flex items-center gap-5">
        <div className="relative flex h-26 w-26 shrink-0 items-center justify-center rounded-full bg-[var(--surface-raised)]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(var(--accent) ${safeScore * 3.6}deg, var(--border-subtle) 0deg)`,
            }}
          />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-[var(--surface)]">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{safeScore}</span>
          </div>
        </div>

        <p className="text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

export default FinancialHealthCard;
