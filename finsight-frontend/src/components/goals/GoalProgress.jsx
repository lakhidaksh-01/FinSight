import {
  Target,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * GoalProgress
 * ------------
 * Compact goal progress card.
 */
function GoalProgress({ goal }) {
  if (!goal) return null;

  const target = Number(goal.targetAmount ?? goal.target ?? 0);
  const current = Number(goal.currentAmount ?? goal.savedAmount ?? 0);
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const completed = progress >= 100;

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          {completed ? <CheckCircle2 size={20} /> : <Target size={20} />}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Goal Progress</p>
          <h3 className="mt-1 font-semibold tracking-tight text-[var(--text-primary)]">{goal.name || goal.title || "Financial Goal"}</h3>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Current</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(current)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Target</p>
            <p className="mt-1 font-semibold text-[var(--text-secondary)]">{formatCurrency(target)}</p>
          </div>
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-[var(--border-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--gradient-primary)] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-[var(--accent)]">{progress.toFixed(1)}%</span>
          <span className="text-[var(--text-muted)]">
            {completed ? "Goal completed" : `${formatCurrency(Math.max(target - current, 0))} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoalProgress;
