import { useState } from "react";
import { Activity, BrainCircuit, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import PredictionChart from "../../components/predictions/PredictionChart";
import PredictionHistory from "../../components/predictions/PredictionHistory";
import Button from "../../components/common/Button";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import ModelInfo from "../../components/predictions/ModelInfo";
import PageHeader from "../../components/layout/PageHeader";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { usePredictions } from "../../hooks/usePredictions";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Predictions() {
  const {
    historyMonths,
    setHistoryMonths,
    horizon,
    setHorizon,
    forecast,
    chartSeries,
    confidence,
    trend,
    insufficientData,
    generating,
    generate,
    history,
    latest,
    loading,
    error,
    refresh,
    anomalyCount,
  } = usePredictions();
  const [selected, setSelected] = useState(null);
  const trendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity;

  const save = async () => {
    try {
      const records = await generate();
      toast.success(`${records.length} forecast months saved`);
    } catch (saveError) {
      toast.error(saveError.message || "Could not save this forecast.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Predictions" }]} />
      <PageHeader
        title="Predictions"
        eyebrow="Intelligence"
        description="A transparent projection based on your recorded spending history."
        action={
          <Button
            onClick={save}
            loading={generating || loading}
            icon={BrainCircuit}
            className="bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)]"
          >
            Generate forecast
          </Button>
        }
      />
      {error && <ErrorState message={error} onRetry={refresh} />}
      {insufficientData && !loading && (
        <div className="rounded-2xl border border-[var(--warning)]/20 bg-[var(--warning-soft)] px-4 py-3 text-sm text-[var(--warning)]">
          This estimate is based on limited history. Add at least three months of expenses for a more reliable trend.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Next month estimate"
          value={formatCurrency(forecast[0]?.amount || 0)}
          detail={forecast[0]?.label || "Forecast unavailable"}
          icon={TrendingDown}
          tone="warning"
        />
        <MetricCard
          label="Forecast confidence"
          value={`${confidence}%`}
          detail={
            insufficientData
              ? "Limited recorded history"
              : "Based on historical fit"
          }
          icon={BrainCircuit}
          tone="info"
        />
        <MetricCard
          label="Trend direction"
          value={
            trend === "up"
              ? "Rising"
              : trend === "down"
                ? "Falling"
                : "Stable"
          }
          detail="Expense trajectory"
          icon={trendIcon}
          tone={trend === "up" ? "danger" : "success"}
        />
        <MetricCard
          label="Latest saved estimate"
          value={formatCurrency(latest?.predictedAmount || 0)}
          detail={latest?.period || "No saved prediction yet"}
          icon={Activity}
          tone="success"
        />
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <div className="grid gap-2 text-xs">
          <label className="font-medium text-[var(--text-muted)]">History window</label>
          <select
            value={historyMonths}
            onChange={(event) => setHistoryMonths(event.target.value)}
            className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          >
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
          </select>
        </div>
        <div className="grid gap-2 text-xs">
          <label className="font-medium text-[var(--text-muted)]">Forecast horizon</label>
          <select
            value={horizon}
            onChange={(event) => setHorizon(event.target.value)}
            className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          >
            {[1, 2, 3, 6, 9, 12].map((months) => (
              <option key={months} value={months}>
                {months} {months === 1 ? "month" : "months"}
              </option>
            ))}
          </select>
        </div>
        <p className="ml-auto max-w-sm text-xs leading-5 text-[var(--text-muted)]">
          {anomalyCount > 0
            ? `The latest model run detected ${anomalyCount} unusual expense${anomalyCount === 1 ? "" : "s"}. `
            : ""}
          Forecasts use the server ML pipeline and your recorded monthly expense totals; they are estimates, not financial advice.
        </p>
      </div>

      <PredictionChart
        data={chartSeries}
        title="Spending forecast"
        description="Historical monthly expenses and projected future spending."
      />

      <ModelInfo confidence={confidence} dataPoints={history.length} />

      <PredictionHistory predictions={history} onSelect={setSelected} />

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <section
            className="w-full max-w-sm rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-lg)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="font-semibold tracking-tight text-[var(--text-primary)]">
              {selected.period || "Saved prediction"}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] numeric">
              {formatCurrency(selected.predictedAmount)}
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Confidence: {selected.confidence || 0}%
            </p>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-5 rounded-xl border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-raised)]"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
