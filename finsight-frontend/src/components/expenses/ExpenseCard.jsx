import { Pencil, Trash2, Receipt, CalendarDays } from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/*
 * ExpenseCard
 * -----------
 * Premium card view of a single expense.
 */
function ExpenseCard({ expense, onEdit, onDelete }) {
  if (!expense) return null;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-1 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
            <Receipt size={19} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold tracking-tight text-[var(--text-primary)]">
              {expense.description || "Untitled Expense"}
            </h3>
            <span className="mt-1 inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
              {expense.category || "Other"}
            </span>
          </div>
        </div>

        <p className="shrink-0 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(expense.amount)}</p>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--text-muted)]">
        <CalendarDays size={15} />
        <span>{formatDate(expense.date)}</span>
      </div>

      {expense.notes && (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{expense.notes}</p>
      )}

      <div className="mt-5 flex justify-end gap-2 border-t border-[var(--border-subtle)] pt-4">
        <Button variant="outline" size="small" icon={<Pencil size={14} />} onClick={() => onEdit?.(expense)}>Edit</Button>
        <Button variant="ghost" size="small" icon={<Trash2 size={14} />} onClick={() => onDelete?.(expense)} className="text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]">Delete</Button>
      </div>
    </div>
  );
}

export default ExpenseCard;
