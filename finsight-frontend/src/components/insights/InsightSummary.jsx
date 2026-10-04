import {
  Sparkles,
  ShieldAlert,
  ScanSearch,
  Lightbulb,
} from "lucide-react";

function SummaryItem({
  icon: Icon,
  label,
  value,
  description,
  iconClassName,
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-lg font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InsightSummary({
  totalInsights = 0,
  riskCount = 0,
  anomalyCount = 0,
  actionableCount = 0,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={Sparkles}
          label="Insights"
          value={totalInsights}
          description="Financial observations"
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={ShieldAlert}
          label="Risk Signals"
          value={riskCount}
          description="Items requiring attention"
          iconClassName="bg-red-50 text-red-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={ScanSearch}
          label="Anomalies"
          value={anomalyCount}
          description="Unusual activity"
          iconClassName="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SummaryItem
          icon={Lightbulb}
          label="Actionable"
          value={actionableCount}
          description="Useful next steps"
          iconClassName="bg-blue-50 text-blue-600"
        />
      </div>
    </div>
  );
}

export default InsightSummary;
