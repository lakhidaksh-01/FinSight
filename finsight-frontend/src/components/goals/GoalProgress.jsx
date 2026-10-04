import {
  Target,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function GoalProgress({
  goal,
}) {
  if (!goal) {
    return null;
  }

  const target = Number(
    goal.targetAmount ?? goal.target ?? 0
  );

  const current = Number(
    goal.currentAmount ?? goal.savedAmount ?? 0
  );

  const percentage =
    target > 0 ? (current / target) * 100 : 0;

  const progress = Math.min(Math.max(percentage, 0), 100);
  const completed = progress >= 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {completed ? (
            <CheckCircle2 size={20} />
          ) : (
            <Target size={20} />
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Goal Progress
          </p>

          <h3 className="mt-1 font-semibold text-slate-900">
            {goal.name || goal.title || "Financial Goal"}
          </h3>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">Current</p>
            <p className="mt-1 text-3xl font-bold text-slate-950">
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

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-purple-600">
            {progress.toFixed(1)}%
          </span>

          <span className="text-slate-500">
            {completed
              ? "Goal completed"
              : `${formatCurrency(Math.max(target - current, 0))} remaining`}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoalProgress;
