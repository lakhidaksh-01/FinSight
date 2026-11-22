import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const TYPE_CONFIG = {
  info: {
    icon: Info,
    container: "border-[var(--info)]/20 bg-[var(--info-soft)]",
    iconBox: "bg-[var(--info-soft)] text-[var(--info)]",
    title: "text-[var(--text-primary)]",
  },
  warning: {
    icon: AlertTriangle,
    container: "border-[var(--warning)]/20 bg-[var(--warning-soft)]",
    iconBox: "bg-[var(--warning-soft)] text-[var(--warning)]",
    title: "text-[var(--text-primary)]",
  },
  success: {
    icon: CheckCircle2,
    container: "border-[var(--success)]/20 bg-[var(--success-soft)]",
    iconBox: "bg-[var(--success-soft)] text-[var(--success)]",
    title: "text-[var(--text-primary)]",
  },
  risk: {
    icon: AlertTriangle,
    container: "border-[var(--danger)]/20 bg-[var(--danger-soft)]",
    iconBox: "bg-[var(--danger-soft)] text-[var(--danger)]",
    title: "text-[var(--text-primary)]",
  },
  ai: {
    icon: Lightbulb,
    container: "border-[var(--accent)]/20 bg-[var(--accent-soft)]",
    iconBox: "bg-[var(--accent-soft)] text-[var(--accent)]",
    title: "text-[var(--text-primary)]",
  },
};

function InsightCard({ insight, onAction }) {
  if (!insight) return null;

  const type = insight.type || "info";
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] ${config.container}`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBox}`}>
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`font-semibold tracking-tight ${config.title}`}>
              {insight.title || "Financial Insight"}
            </h3>

            {insight.category && (
              <span className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] capitalize">
                {insight.category}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            {insight.message || insight.description || "No additional information available."}
          </p>

          {insight.value !== undefined && (
            <p className="mt-3 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">
              {insight.value}
            </p>
          )}

          {onAction && insight.actionLabel && (
            <button
              type="button"
              onClick={() => onAction(insight)}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              {insight.actionLabel}
              <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InsightCard;
