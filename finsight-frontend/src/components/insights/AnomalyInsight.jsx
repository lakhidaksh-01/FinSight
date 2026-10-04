import {
  ScanSearch,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function AnomalyInsight({
  anomaly = null,
  title = "Spending Anomaly",
}) {
  if (!anomaly) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              No unusual activity detected
            </h3>

            <p className="mt-1 text-sm text-slate-600">
              Your recent spending is within the patterns available to FinSight.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const amount =
    anomaly.amount !== undefined
      ? Number(anomaly.amount)
      : null;

  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          {anomaly.severity === "high" ? (
            <AlertCircle size={20} />
          ) : (
            <ScanSearch size={20} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900">
              {anomaly.title || title}
            </h3>

            {anomaly.category && (
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-600">
                {anomaly.category}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {anomaly.message ||
              anomaly.description ||
              "An unusual spending pattern was detected."}
          </p>

          {amount !== null && (
            <p className="mt-3 font-bold text-slate-900">
              {formatCurrency(amount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnomalyInsight;
