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
    container: "border-blue-100 bg-blue-50/50",
    iconBox: "bg-blue-100 text-blue-600",
    title: "text-blue-900",
  },
  warning: {
    icon: AlertTriangle,
    container: "border-amber-100 bg-amber-50/60",
    iconBox: "bg-amber-100 text-amber-600",
    title: "text-amber-900",
  },
  success: {
    icon: CheckCircle2,
    container: "border-emerald-100 bg-emerald-50/60",
    iconBox: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-900",
  },
  risk: {
    icon: AlertTriangle,
    container: "border-red-100 bg-red-50/60",
    iconBox: "bg-red-100 text-red-600",
    title: "text-red-900",
  },
  ai: {
    icon: Lightbulb,
    container: "border-purple-100 bg-purple-50/50",
    iconBox: "bg-purple-100 text-purple-600",
    title: "text-purple-900",
  },
};

function InsightCard({
  insight,
  onAction,
}) {
  if (!insight) {
    return null;
  }

  const type = insight.type || "info";
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${config.container}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.iconBox}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`font-semibold ${config.title}`}>
              {insight.title || "Financial Insight"}
            </h3>

            {insight.category && (
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium capitalize text-slate-600">
                {insight.category}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {insight.message ||
              insight.description ||
              "No additional information available."}
          </p>

          {insight.value !== undefined && (
            <p className="mt-3 text-lg font-bold text-slate-900">
              {insight.value}
            </p>
          )}

          {onAction && insight.actionLabel && (
            <button
              type="button"
              onClick={() => onAction(insight)}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-purple-600"
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
