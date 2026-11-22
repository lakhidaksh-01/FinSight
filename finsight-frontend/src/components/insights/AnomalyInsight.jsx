import {
  ScanSearch,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * AnomalyInsight
 * --------------
 * Spending anomaly detection card.
 */
function AnomalyInsight({ anomaly = null, title = "Spending Anomaly" }) {
  if (!anomaly) {
    return (
      <div className="rounded-3xl border border-[var(--success)]/20 bg-[var(--success-soft)] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success)] text-[var(--text-inverse)] shadow-lg shadow-[var(--success)]/20">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">No unusual activity detected</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Your recent spending is within the patterns available to FinSight.</p>
          </div>
        </div>
      </div>
    );
  }

  const amount = anomaly.amount !== undefined ? Number(anomaly.amount) : null;

  return (
    <div className="rounded-3xl border border-[var(--warning)]/20 bg-[var(--warning-soft)] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] shadow-sm text-[var(--warning)]">
          {anomaly.severity === "high" ? <AlertCircle size={20} /> : <ScanSearch size={20} />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{anomaly.title || title}</h3>
            {anomaly.category && (
              <span className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
                {anomaly.category}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {anomaly.message || anomaly.description || "An unusual spending pattern was detected."}
          </p>

          {amount !== null && (
            <p className="mt-3 font-bold tracking-tight text-[var(--text-primary)]">{formatCurrency(amount)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnomalyInsight;
