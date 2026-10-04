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

function GoalCard({
  goal,
  onEdit,
  onDelete,
  onSelect,
}) {
  if (!goal) {
    return null;
  }

  const target = Number(
    goal.targetAmount ?? goal.target ?? 0
  );

  const current = Number(
    goal.currentAmount ?? goal.savedAmount ?? goal.progress ?? 0
  );

  const percentage =
    target > 0 ? (current / target) * 100 : 0;

  const progress = Math.min(Math.max(percentage, 0), 100);
  const completed = progress >= 100;

  return (
    <div
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/30"
    >
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onSelect?.(goal)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-purple-600">
            {completed ? (
              <CheckCircle2 size={20} />
            ) : (
              <Target size={20} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {goal.name || goal.title || "Financial Goal"}
            </h3>

            <p className="mt-1 text-xs capitalize text-slate-500">
              {goal.category || "Savings"}
            </p>
          </div>
        </button>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            completed
              ? "bg-emerald-50 text-emerald-600"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {completed ? "Completed" : `${progress.toFixed(0)}%`}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-500">Saved</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(current)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">Target</p>
          <p className="mt-1 font-semibold text-slate-700">
            {formatCurrency(target)}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{progress.toFixed(1)}% complete</span>

        <span>
          {completed
            ? "Target reached"
            : `${formatCurrency(Math.max(target - current, 0))} remaining`}
        </span>
      </div>

      {goal.deadline && (
        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <CalendarDays size={14} />
          <span>Deadline {formatDate(goal.deadline)}</span>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="outline"
          size="small"
          icon={Pencil}
          onClick={() => onEdit?.(goal)}
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          size="small"
          icon={Trash2}
          onClick={() => onDelete?.(goal)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default GoalCard;