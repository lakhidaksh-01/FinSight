import {
  Pencil,
  Trash2,
  Wallet,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function IncomeCard({
  income,
  onEdit,
  onDelete,
}) {
  if (!income) {
    return null;
  }

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 text-emerald-600">
            <Wallet size={19} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {income.description || "Income"}
            </h3>

            <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {income.source || "Other"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-emerald-600">
          <ArrowUpRight size={16} />

          <p className="text-lg font-bold">
            {formatCurrency(income.amount)}
          </p>
        </div>
      </div>

      {/* Date */}
      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <CalendarDays size={15} />
        <span>{formatDate(income.date)}</span>
      </div>

      {/* Actions */}
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button
          variant="outline"
          size="small"
          icon={<Pencil size={14} />}
          onClick={() => onEdit?.(income)}
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          size="small"
          icon={<Trash2 size={14} />}
          onClick={() => onDelete?.(income)}
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default IncomeCard;