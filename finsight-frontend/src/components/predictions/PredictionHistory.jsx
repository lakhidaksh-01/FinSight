import {
  BrainCircuit,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

/*
 * PredictionHistory
 * -----------------
 * List of previously generated forecasts.
 */
function PredictionHistory({ predictions = [], onSelect }) {
  if (!predictions.length) {
    return (
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-sm)] sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <BrainCircuit size={21} />
        </div>
        <h3 className="mt-4 font-semibold tracking-tight text-[var(--text-primary)]">No prediction history</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Your generated predictions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--border-subtle)] px-5 py-4 sm:px-6">
        <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Prediction History</h3>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Previously generated financial forecasts</p>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {predictions.map((prediction) => {
          const id = prediction._id || prediction.id;
          const amount = Number(prediction.predictedAmount ?? prediction.amount ?? prediction.value ?? 0);

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect?.(prediction)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface-raised)]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <BrainCircuit size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--text-primary)]">{prediction.period || "Financial forecast"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                  {prediction.createdAt && (
                    <>
                      <CalendarDays size={13} />
                      <span>{formatDate(prediction.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-[var(--text-primary)] numeric">{formatCurrency(amount)}</span>
                <ChevronRight size={17} className="text-[var(--text-muted)]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PredictionHistory;
