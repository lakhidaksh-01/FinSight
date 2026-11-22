import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * PredictionCard
 * --------------
 * Single prediction forecast card.
 */
function PredictionCard({ prediction, title = "Financial Prediction" }) {
  if (!prediction) {
    return (
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">No prediction available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const predictedAmount = Number(prediction.predictedAmount ?? prediction.amount ?? prediction.value ?? 0);
  const confidence = Number(prediction.confidence || 0);
  const trend = prediction.trend || "stable";

  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
        ? TrendingDown
        : Minus;

  const trendClasses =
    trend === "up"
      ? "bg-[var(--success-soft)] text-[var(--success)]"
      : trend === "down"
        ? "bg-[var(--danger-soft)] text-[var(--danger)]"
        : "bg-[var(--surface-raised)] text-[var(--text-muted)]";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:-translate-y-1 sm:p-7">
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[var(--accent-soft)] blur-[48px]" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/20">
              <BrainCircuit size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">AI Prediction</p>
              <h3 className="mt-1 font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
            </div>
          </div>

          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${trendClasses}`}>
            <TrendIcon size={17} />
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Predicted Amount</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] numeric">{formatCurrency(predictedAmount)}</p>
        </div>

        {prediction.period && (
          <p className="mt-2 text-sm text-[var(--text-muted)]">Forecast for {prediction.period}</p>
        )}

        {confidence > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--text-muted)]">Model confidence</span>
              <span className="font-semibold text-[var(--text-primary)]">{confidence.toFixed(0)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div
                className="h-full rounded-full bg-[var(--gradient-primary)]"
                style={{ width: `${Math.min(Math.max(confidence, 0), 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionCard;
