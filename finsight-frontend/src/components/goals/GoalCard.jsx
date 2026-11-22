import {
  Pencil,
  Trash2,
  Target,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/*
 * GoalCard
 * --------
 * Savings goal card with progress.
 */
function GoalCard({ goal, onEdit, onDelete, onSelect }) {
  if (!goal) return null;

  const target = Number(goal.targetAmount ?? goal.target ?? 0);
  const current = Number(goal.currentAmount ?? goal.savedAmount ?? goal.progress ?? 0);
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const progress = Math.min(Math.max(percentage, 0), 100);
  const completed = progress >= 100;

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-1 sm:p-6"
    >
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--accent-soft)] blur-[64px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <button
            type="button"
            onClick={() => onSelect?.(goal)}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              {completed ? <CheckCircle2 size={20} /> : <Target size={20} />}
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold tracking-tight text-[var(--text-primary)]">
                {goal.name || goal.title || "Financial Goal"}
              </h3>
              <p className="mt-1 text-xs capitalize text-[var(--text-muted)]">
                {goal.category || "Savings"}
              </p>
            </div>
          </button>

          <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            completed
              ? "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20"
              : "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20"
          }`}>
            {completed ? "Completed" : `${progress.toFixed(0)}%`}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Saved</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(current)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Target</p>
            <p className="mt-1 font-semibold text-[var(--text-secondary)]">{formatCurrency(target)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--gradient-primary)] transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--text-muted)]">
            <span>{progress.toFixed(1)}% complete</span>
            <span>
              {completed
                ? "Target reached"
                : `${formatCurrency(Math.max(target - current, 0))} remaining`}
            </span>
          </div>
        </div>

        {goal.deadline && (
          <div className="mt-5 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
            <CalendarDays size={14} />
            <span>Deadline {formatDate(goal.deadline)}</span>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="small" icon={Pencil} onClick={() => onEdit?.(goal)}>Edit</Button>
          <Button variant="ghost" size="small" icon={Trash2} onClick={() => onDelete?.(goal)} className="text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]">Delete</Button>
        </div>
      </div>
    </div>
  );
}

export default GoalCard;
