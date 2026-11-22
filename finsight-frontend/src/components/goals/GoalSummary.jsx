import {
  Target,
  PiggyBank,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryItem({ icon: Icon, label, value, description, iconClassName }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="mt-1 truncate text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">{value}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  );
}

function GoalSummary({ goals = [] }) {
  const totalTarget = goals.reduce((total, goal) => total + Number(goal.targetAmount ?? goal.target ?? 0), 0);
  const totalSaved = goals.reduce((total, goal) => total + Number(goal.currentAmount ?? goal.savedAmount ?? 0), 0);
  const completedGoals = goals.filter((goal) => {
    const target = Number(goal.targetAmount ?? goal.target ?? 0);
    const current = Number(goal.currentAmount ?? goal.savedAmount ?? 0);
    return target > 0 && current >= target;
  }).length;
  const overallProgress = totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Target} label="Active Goals" value={goals.length} description="Financial targets" iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={PiggyBank} label="Total Saved" value={formatCurrency(totalSaved)} description="Across all goals" iconClassName="bg-[var(--success-soft)] text-[var(--success)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={TrendingUp} label="Overall Progress" value={`${overallProgress.toFixed(1)}%`} description={`Total target ${formatCurrency(totalTarget)}`} iconClassName="bg-[var(--info-soft)] text-[var(--info)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={CheckCircle2} label="Completed" value={completedGoals} description="Goals reached" iconClassName="bg-[var(--success-soft)] text-[var(--success)]" />
      </div>
    </div>
  );
}

export default GoalSummary;
