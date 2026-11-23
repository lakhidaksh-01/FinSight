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

/*
 * IncomeCard
 * ----------
 * Premium card view of a single income record.
 */
function IncomeCard({ income, onEdit, onDelete }) {
  if (!income) return null;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-1 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
            <Wallet size={19} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold tracking-tight text-[var(--text-primary)]">
              {income.description || "Income"}
            </h3>
            <span className="mt-1 inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
              {income.source || "Other"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[var(--success)]">
          <ArrowUpRight size={16} />
          <p className="text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(income.amount)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4 text-sm text-[var(--text-muted)]">
        <CalendarDays size={15} />
        <span>{formatDate(income.date)}</span>
      </div>

      <div className="mt-5 flex justify-end gap-2 border-t border-[var(--border-subtle)] pt-4">
        <Button variant="outline" size="small" icon={Pencil} onClick={() => onEdit?.(income)}>Edit</Button>
        <Button variant="ghost" size="small" icon={Trash2} onClick={() => onDelete?.(income)} className="text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]">Delete</Button>
      </div>
    </div>
  );
}

export default IncomeCard;
