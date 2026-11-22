import {
  Sparkles,
  ShieldAlert,
  ScanSearch,
  Lightbulb,
} from "lucide-react";

function SummaryItem({ icon: Icon, label, value, description, iconClassName }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon size={19} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="mt-1 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">{value}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  );
}

function InsightSummary({ totalInsights = 0, riskCount = 0, anomalyCount = 0, actionableCount = 0 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Sparkles} label="Insights" value={totalInsights} description="Financial observations" iconClassName="bg-[var(--accent-soft)] text-[var(--accent)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={ShieldAlert} label="Risk Signals" value={riskCount} description="Items requiring attention" iconClassName="bg-[var(--danger-soft)] text-[var(--danger)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={ScanSearch} label="Anomalies" value={anomalyCount} description="Unusual activity" iconClassName="bg-[var(--warning-soft)] text-[var(--warning)]" />
      </div>
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <SummaryItem icon={Lightbulb} label="Actionable" value={actionableCount} description="Useful next steps" iconClassName="bg-[var(--info-soft)] text-[var(--info)]" />
      </div>
    </div>
  );
}

export default InsightSummary;
