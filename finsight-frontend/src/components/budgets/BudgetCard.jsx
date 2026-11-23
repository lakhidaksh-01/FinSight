import {
  Pencil,
  Trash2,
  WalletCards,
  CalendarDays,
} from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/*
 * BudgetCard
 * ----------
 * Single budget with utilisation progress.
 */
function BudgetCard({ budget, onEdit, onDelete }) {
  if (!budget) return null;

  const amount = Number(budget.amount || 0);
  const spent = Number(budget.spent || 0);
  const percentage = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;
  const remaining = Math.max(amount - spent, 0);
  const isOverBudget = spent > amount;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-1 sm:p-6">
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[var(--accent-soft)] blur-[64px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <WalletCards size={19} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-semibold tracking-tight text-[var(--text-primary)]">
                {budget.category || "General Budget"}
              </h3>
              <p className="mt-1 text-xs capitalize text-[var(--text-muted)]">
                {budget.period || "Monthly"} budget
              </p>
            </div>
          </div>

          <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
            isOverBudget
              ? "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20"
              : "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/20"
          }`}>
            {isOverBudget ? "Over budget" : "On track"}
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Spent</p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(spent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--text-muted)]">Budget</p>
            <p className="mt-1 font-semibold text-[var(--text-secondary)]">{formatCurrency(amount)}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">{percentage.toFixed(0)}% used</span>
            <span className={`font-semibold ${isOverBudget ? "text-[var(--danger)]" : "text-[var(--text-secondary)]"}`}>
              {isOverBudget ? `${formatCurrency(spent - amount)} over` : `${formatCurrency(remaining)} left`}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOverBudget ? "bg-[var(--danger)]" : "bg-[var(--gradient-primary)]"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {budget.startDate && (
          <div className="mt-5 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-muted)]">
            <CalendarDays size={14} />
            <span>Started {formatDate(budget.startDate)}</span>
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="small" icon={Pencil} onClick={() => onEdit?.(budget)}>
            Edit
          </Button>
          <Button variant="ghost" size="small" icon={Trash2} onClick={() => onDelete?.(budget)} className="text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BudgetCard;
