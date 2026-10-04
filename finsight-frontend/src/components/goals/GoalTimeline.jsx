import {
  CalendarDays,
  Target,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";

function GoalTimeline({
  goals = [],
}) {
  const sortedGoals = [...goals]
    .filter((goal) => goal.deadline)
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    );

  if (!sortedGoals.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Goal Timeline
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add deadlines to your goals to see them organized here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <CalendarDays size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">
            Goal Timeline
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Upcoming financial milestones
          </p>
        </div>
      </div>

      <div className="relative mt-7 space-y-6">
        <div className="absolute bottom-3 left-5 top-3 w-px bg-slate-200" />

        {sortedGoals.map((goal) => {
          const target = Number(
            goal.targetAmount ?? goal.target ?? 0
          );

          const current = Number(
            goal.currentAmount ?? goal.savedAmount ?? 0
          );

          const completed =
            target > 0 && current >= target;

          return (
            <div
              key={goal._id || goal.id}
              className="relative flex gap-4"
            >
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ${
                  completed
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {completed ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Target size={16} />
                )}
              </div>

              <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {goal.name || goal.title || "Financial Goal"}
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      {goal.category || "Savings"}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    {completed ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <Clock3 size={13} />
                    )}

                    {formatDate(goal.deadline)}
                  </span>
                </div>

                <div className="mt-3 text-sm text-slate-600">
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
