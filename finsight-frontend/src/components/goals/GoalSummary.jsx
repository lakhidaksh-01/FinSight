import {
  Target,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryItem({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 truncate text-lg font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function GoalSummary({
  goals = [],
}) {
  const totalTarget = goals.reduce(
    (total, goal) =>
      total + Number(goal.targetAmount ?? goal.target ?? 0),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total +
      Number(goal.currentAmount ?? goal.savedAmount ?? 0),
    0
  );

  const completedGoals = goals.filter((goal) => {
    const target = Number(
      goal.targetAmount ?? goal.target ?? 0
    );

    const current = Number(
      goal.currentAmount ?? goal.savedAmount ?? 0
    );

    return target > 0 && current >= target;
  }).length;

  const overallProgress =
    totalTarget > 0
      ? Math.min((totalSaved / totalTarget) * 100, 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={Target}
          label="Active Goals"
          value={goals.length}
          description="Financial targets"
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={PiggyBank}
          label="Total Saved"
          value={formatCurrency(totalSaved)}
          description="Across all goals"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={TrendingUp}
          label="Overall Progress"
          value={`${overallProgress.toFixed(1)}%`}
          description={formatCurrency(totalTarget) + " total target"}
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={CheckCircle2}
          label="Completed"
          value={completedGoals}
          description="Goals reached"
          iconClassName="bg-indigo-50 text-indigo-600"
        />
      </div>
    </div>
  );
}

export default GoalSummary;
