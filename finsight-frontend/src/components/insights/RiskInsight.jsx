import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * RiskInsight
 * -----------
 * Financial risk level card.
 */
function RiskInsight({ riskLevel = "low", title = "Financial Risk", message, amount = null }) {
  const normalizedLevel = String(riskLevel).toLowerCase();

  const isHigh = normalizedLevel === "high" || normalizedLevel === "critical";
  const isMedium = normalizedLevel === "medium" || normalizedLevel === "moderate";

  const config = isHigh
    ? {
        icon: ShieldAlert,
        iconClass: "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/20",
        container: "border-[var(--danger)]/20 bg-[var(--danger-soft)]",
        badge: "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20",
        label: "High Risk",
      }
    : isMedium
      ? {
          icon: AlertTriangle,
          iconClass: "bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20",
          container: "border-[var(--warning)]/20 bg-[var(--warning-soft)]",
          badge: "bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20",
          label: "Moderate Risk",
        }
      : {
          icon: ShieldCheck,
          iconClass: "bg-[var(--success)] text-[var(--text-inverse)] shadow-lg shadow-[var(--success)]/20",
          container: "border-[var(--success)]/20 bg-[var(--success-soft)]",
          badge: "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20",
          label: "Low Risk",
        };

  const Icon = config.icon;

  return (
    <div className={`rounded-3xl p-5 ${config.container}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconClass}`}>
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
            <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${config.badge}`}>{config.label}</span>
          </div>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {message || "Risk indicators are based on the financial information currently available."}
          </p>

          {amount !== null && (
            <p className="mt-3 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">
              {formatCurrency(amount)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskInsight;
