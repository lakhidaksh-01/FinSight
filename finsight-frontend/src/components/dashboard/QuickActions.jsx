import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  Target,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

/*
 * QuickActions
 * ------------
 * Fast access to common financial actions.
 */
const actions = [
  { label: "Add Expense", description: "Record spending", path: "/app/expenses", icon: ArrowDownToLine, tone: "info" },
  { label: "Add Income", description: "Record earnings", path: "/app/income", icon: ArrowUpFromLine, tone: "success" },
  { label: "Create Budget", description: "Set a spending limit", path: "/app/budgets", icon: WalletCards, tone: "primary" },
  { label: "New Goal", description: "Start saving", path: "/app/goals", icon: Target, tone: "warning" },
];

const toneColors = {
  primary: "text-[var(--accent)] bg-[var(--accent-soft)]",
  success: "text-[var(--success)] bg-[var(--success-soft)]",
  warning: "text-[var(--warning)] bg-[var(--warning-soft)]",
  info: "text-[var(--info)] bg-[var(--info-soft)]",
};

function QuickActions() {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div>
        <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Quick Actions</h3>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Manage your finances faster</p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.path}
              to={action.path}
              state={{ openForm: action.path.split("/").at(-1) }}
              className="group flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4 transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneColors[action.tone] || toneColors.primary}`}>
                <Icon size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{action.label}</p>
                <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">{action.description}</p>
              </div>

              <Plus size={15} className="text-[var(--text-muted)] transition-all group-hover:rotate-90 group-hover:text-[var(--accent)]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
