import { useState } from "react";
import { Activity, BrainCircuit, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import PredictionChart from "../../components/predictions/PredictionChart";
import PredictionHistory from "../../components/predictions/PredictionHistory";
import Button from "../../components/common/Button";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/layout/PageHeader";
import { usePredictions } from "../../hooks/usePredictions";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Predictions() {
  const { historyMonths, setHistoryMonths, horizon, setHorizon, forecast, chartSeries, confidence, trend, insufficientData, generating, generate, history, latest, loading, error, refresh } = usePredictions();
  const [selected, setSelected] = useState(null);
  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity;

  const save = async () => {
    try {
      const records = await generate();
      toast.success(`${records.length} forecast months saved`);
    } catch (saveError) {
      toast.error(saveError.message || "Could not save this forecast.");
    }
  };

  return <div className="space-y-6">
    <PageHeader title="Predictions" eyebrow="Intelligence" description="A transparent projection based on your recorded spending history." action={<Button onClick={save} loading={generating || loading} icon={BrainCircuit} className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Generate forecast</Button>} />
    {error && <ErrorState message={error} onRetry={refresh} />}
    {insufficientData && !loading && <p className="rounded-lg border border-[#d5a96d]/20 bg-[#d5a96d]/[0.07] px-4 py-3 text-sm text-[#e2bc85]">This estimate is based on limited history. Add at least three months of expenses for a more reliable trend.</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Next month estimate" value={formatCurrency(forecast[0]?.amount || 0)} detail={forecast[0]?.label || "Forecast unavailable"} icon={TrendingDown} tone="amber" />
      <MetricCard label="Forecast confidence" value={`${confidence}%`} detail={insufficientData ? "Limited recorded history" : "Based on historical fit"} icon={BrainCircuit} tone="blue" />
      <MetricCard label="Trend direction" value={trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable"} detail="Expense trajectory" icon={trendIcon} tone={trend === "up" ? "rose" : "mint"} />
      <MetricCard label="Latest saved estimate" value={formatCurrency(latest?.predictedAmount || 0)} detail={latest?.period || "No saved prediction yet"} icon={Activity} tone="mint" />
    </div>
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-white/[0.08] bg-[#121a16] p-4">
      <label className="grid gap-2 text-xs text-[#91a097]">History window<select value={historyMonths} onChange={(event) => setHistoryMonths(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#0d1410] px-3 text-sm text-white"><option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option></select></label>
      <label className="grid gap-2 text-xs text-[#91a097]">Forecast horizon<select value={horizon} onChange={(event) => setHorizon(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#0d1410] px-3 text-sm text-white">{[1, 2, 3, 6, 9, 12].map((months) => <option key={months} value={months}>{months} {months === 1 ? "month" : "months"}</option>)}</select></label>
      <p className="ml-auto max-w-sm text-xs leading-5 text-[#829087]">Forecasts use a linear fit of your own monthly expense totals; they are estimates, not financial advice.</p>
    </div>
    <PredictionChart data={chartSeries} title="Spending forecast" description="Historical monthly expenses and projected future spending." />
    <PredictionHistory predictions={history} onSelect={setSelected} />
    {selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}><section className="w-full max-w-sm rounded-xl border border-white/10 bg-[#111a16] p-5" onClick={(event) => event.stopPropagation()}><h2 className="font-semibold">{selected.period || "Saved prediction"}</h2><p className="mt-2 text-2xl font-semibold">{formatCurrency(selected.predictedAmount)}</p><p className="mt-2 text-sm text-[#91a097]">Confidence: {selected.confidence || 0}%</p><button type="button" onClick={() => setSelected(null)} className="mt-5 rounded-lg border border-white/10 px-3 py-2 text-sm text-white">Close</button></section></div>}
  </div>;
}