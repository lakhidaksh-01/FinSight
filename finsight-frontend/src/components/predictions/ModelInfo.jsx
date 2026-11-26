import {
  BrainCircuit,
  Database,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * ModelInfo
 * ---------
 * Details about the prediction engine.
 */
function ModelInfo({
  modelName = null,
  dataPoints = null,
  fitScore = null,
  fitScoreMethod = null,
  evaluation = null,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-raised)] to-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-7">
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-[64px]" />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/30">
            <BrainCircuit size={21} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Forecast model</p>
            <h3 className="mt-1 font-semibold tracking-tight text-[var(--text-primary)]">{modelName || "Model metadata unavailable"}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Identifier reported by the Python service</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
            <Database size={17} className="text-[var(--accent)]" />
            <p className="mt-4 text-xs text-[var(--text-muted)]">Monthly observations</p>
            <p className="mt-1 font-semibold tracking-tight text-[var(--text-primary)]">{dataPoints !== null ? dataPoints : "Not available"}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
            <Activity size={17} className="text-[var(--accent)]" />
            <p className="mt-4 text-xs text-[var(--text-muted)]">Relative holdout score</p>
            <p className="mt-1 font-semibold tracking-tight text-[var(--text-primary)]">{fitScore !== null ? `${Number(fitScore).toFixed(1)}%` : "Not evaluated"}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
            <ShieldCheck size={17} className="text-[var(--success)]" />
            <p className="mt-4 text-xs text-[var(--text-muted)]">Holdout MAE</p>
            <p className="mt-1 font-semibold tracking-tight text-[var(--text-primary)]">
              {evaluation?.mae == null
                ? "Not evaluated"
                : formatCurrency(evaluation.mae)}
            </p>
          </div>
        </div>

        <p className="mt-7 text-xs leading-6 text-[var(--text-muted)]">
          Predictions are generated from the financial information available
          in your FinSight account. The relative holdout score uses
          {fitScoreMethod
            ? ` ${fitScoreMethod}. `
            : " rolling holdout MAE normalized by mean holdout spending. "}
          {evaluation?.method === "rolling_origin_one_step" &&
          evaluation.samples > 0
            ? `Rolling one-month-ahead holdout across ${evaluation.samples} month${evaluation.samples === 1 ? "" : "s"}; RMSE: ${evaluation.rmse == null ? "Not available" : formatCurrency(evaluation.rmse)}. `
            : "No rolling holdout metrics are available for this saved forecast. "}
          The score is not a probability that the forecast is correct.
          Forecasts are estimates and should be
          treated as informational rather than guaranteed outcomes.
        </p>
      </div>
    </div>
  );
}

export default ModelInfo;
