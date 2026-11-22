import { Pencil, Trash2, Receipt } from "lucide-react";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/*
 * ExpenseTable
 * ------------
 * Desktop table + mobile card list for expenses.
 */
function ExpenseTable({ expenses = [], onEdit, onDelete, loading = false }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div className="hidden md:block">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-6 border-b border-[var(--border-subtle)] px-6 py-5 last:border-b-0">
              <div className="h-10 w-10 rounded-xl bg-[var(--surface-raised)]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-[var(--surface-raised)]" />
                <div className="h-3 w-28 rounded bg-[var(--surface-raised)]" />
              </div>
              <div className="h-4 w-24 rounded bg-[var(--surface-raised)]" />
              <div className="h-4 w-20 rounded bg-[var(--surface-raised)]" />
              <div className="h-8 w-20 rounded bg-[var(--surface-raised)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <EmptyState
        icon={Receipt}
        title="No expenses found"
        description="Your expenses will appear here once you add your first transaction."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Expense</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Amount</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense._id || expense.id}
                className="border-b border-[var(--border-subtle)] transition-colors last:border-b-0 hover:bg-[var(--surface-raised)]"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
                      <Receipt size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{expense.description || "Untitled Expense"}</p>
                      {expense.notes && (
                        <p className="mt-0.5 max-w-[260px] truncate text-xs text-[var(--text-muted)]">{expense.notes}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                    {expense.category || "Other"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{formatDate(expense.date)}</td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-[var(--text-primary)] numeric">{formatCurrency(expense.amount)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="small" icon={Pencil} onClick={() => onEdit?.(expense)} aria-label="Edit expense" />
                    <Button variant="ghost" size="small" icon={Trash2} onClick={() => onDelete?.(expense)} className="text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]" aria-label="Delete expense" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[var(--border-subtle)] md:hidden">
        {expenses.map((expense) => (
          <div key={expense._id || expense.id} className="p-4 transition-colors hover:bg-[var(--surface-raised)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
                  <Receipt size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-[var(--text-primary)]">{expense.description || "Untitled Expense"}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{formatDate(expense.date)}</p>
                </div>
              </div>
              <p className="shrink-0 font-semibold text-[var(--text-primary)]">{formatCurrency(expense.amount)}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                {expense.category || "Other"}
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="small" icon={Pencil} onClick={() => onEdit?.(expense)} aria-label="Edit expense" />
                <Button variant="ghost" size="small" icon={Trash2} onClick={() => onDelete?.(expense)} aria-label="Delete expense" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseTable;
