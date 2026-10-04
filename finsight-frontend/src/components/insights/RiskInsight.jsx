import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function RiskInsight({
  riskLevel = "low",
  title = "Financial Risk",
  message,
  amount = null,
}) {
  const normalizedLevel = String(riskLevel).toLowerCase();

  const isHigh =
    normalizedLevel === "high" ||
    normalizedLevel === "critical";

  const isMedium =
    normalizedLevel === "medium" ||
    normalizedLevel === "moderate";

  const config = isHigh
    ? {
        icon: ShieldAlert,
        iconClass: "bg-red-100 text-red-600",
        container: "border-red-100 bg-red-50/60",
        badge: "bg-red-100 text-red-700",
        label: "High Risk",
      }
    : isMedium
      ? {
          icon: AlertTriangle,
          iconClass: "bg-amber-100 text-amber-600",
          container: "border-amber-100 bg-amber-50/60",
          badge: "bg-amber-100 text-amber-700",
          label: "Moderate Risk",
        }
      : {
          icon: ShieldCheck,
          iconClass: "bg-emerald-100 text-emerald-600",
          container: "border-emerald-100 bg-emerald-50/60",
          badge: "bg-emerald-100 text-emerald-700",
          label: "Low Risk",
        };

  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border p-5 ${config.container}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900">
              {title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}
            >
              {config.label}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {message ||
              "Risk indicators are based on the financial information currently available."}
          </p>

          {amount !== null && (
            <p className="mt-3 text-lg font-bold text-slate-900">
              {formatCurrency(amount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskInsight;
