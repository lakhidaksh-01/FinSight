import {
  CalendarDays,
  Target,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";

/*
 * GoalTimeline
 * ------------
 * Goals ordered by deadline.
 */
function GoalTimeline({ goals = [] }) {
  const sortedGoals = [...goals]
    .filter((goal) => goal.deadline)
    .sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );

  if (!sortedGoals.length) {
    return (
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
            <CalendarDays size={18} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Goal Timeline</h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Add deadlines to your goals to see them organized here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <CalendarDays size={18} />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Goal Timeline</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Upcoming financial milestones</p>
        </div>
      </div>

      <div className="relative mt-8 space-y-8">
        <div className="absolute top-3 bottom-3 left-6 w-px bg-[var(--border-subtle)]" />

        {sortedGoals.map((goal) => {
          const target = Number(goal.targetAmount ?? goal.target ?? 0);
          const current = Number(goal.currentAmount ?? goal.savedAmount ?? 0);
          const completed = target > 0 && current >= target;

          return (
            <div key={goal._id || goal.id} className="relative flex gap-4">
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[var(--surface)] ${
                completed
                  ? "bg-[var(--success-soft)] text-[var(--success)]"
                  : "bg-[var(--accent-soft)] text-[var(--accent)]"
              }`}>
                {completed ? <CheckCircle2 size={16} /> : <Target size={16} />}
              </div>

              <div className="min-w-0 flex-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold tracking-tight text-[var(--text-primary)]">
                      {goal.name || goal.title || "Financial Goal"}
                    </h4>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{goal.category || "Savings"}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-[var(--text-muted)]">
                    {completed ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                    {formatDate(goal.deadline)}
                  </span>
                </div>
                <div className="mt-3 text-sm text-[var(--text-muted)]">
                  {completed
                    ? "Target reached."
                    : `${Math.max(target - current, 0).toLocaleString()} remaining to reach the target.`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GoalTimeline;
