import { Pencil, Trash2, Receipt, CalendarDays } from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function ExpenseCard({
  expense,
  onEdit,
  onDelete,
}) {
  if (!expense) {
    return null;
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600">
            <Receipt size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {expense.description || "Untitled Expense"}
            </h3>

            <span className="mt-1 inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
              {expense.category || "Other"}
            </span>
          </div>
        </div>

        <p className="shrink-0 text-lg font-bold text-slate-900">
          {formatCurrency(expense.amount)}
        </p>
      </div>

      {/* Details */}
      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <CalendarDays size={15} />
        <span>{formatDate(expense.date)}</span>
      </div>

      {expense.notes && (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {expense.notes}
        </p>
      )}

      {/* Actions */}
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button
          variant="outline"
          size="small"
          icon={<Pencil size={14} />}
          onClick={() => onEdit?.(expense)}
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          size="small"
          icon={<Trash2 size={14} />}
          onClick={() => onDelete?.(expense)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default ExpenseCard;
