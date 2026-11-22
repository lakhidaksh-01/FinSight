import {
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/app";

/*
 * QuickInsights
 * -------------
 * Short financial observations on the dashboard.
 */
function QuickInsights({ insights = [] }) {
  const getInsightStyle = (type) => {
    if (type === "warning") {
      return { icon: AlertTriangle, iconStyle: "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/20", title: "text-[var(--text-primary)]", body: "text-[var(--text-secondary)]" };
    }
    if (type === "success") {
      return { icon: Lightbulb, iconStyle: "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20", title: "text-[var(--text-primary)]", body: "text-[var(--text-secondary)]" };
    }
    if (type === "risk") {
      return { icon: AlertTriangle, iconStyle: "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20", title: "text-[var(--text-primary)]", body: "text-[var(--text-secondary)]" };
    }
    return { icon: Sparkles, iconStyle: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/20", title: "text-[var(--text-primary)]", body: "text-[var(--text-secondary)]" };
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-[64px]" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Sparkles size={18} strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Quick Insights</h3>
              <p className="text-xs text-[var(--text-muted)]">Highlights from your finances</p>
            </div>
          </div>

          <Link
            to={ROUTES.ANALYTICS}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
          >
            Explore
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {insights.length === 0 ? (
            <div className="rounded-2xl bg-[var(--surface-raised)] px-5 py-8 text-center">
              <p className="text-sm font-medium text-[var(--text-secondary)]">No insights available yet</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">More activity will help FinSight surface useful patterns.</p>
            </div>
          ) : (
            insights.slice(0, 3).map((insight, index) => {
              const style = getInsightStyle(insight.type);
              const Icon = style.icon;

              return (
                <div key={insight.id || index} className="flex gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 p-3.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.iconStyle}`}>
                    <Icon size={17} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold {style.title}">{insight.title}</p>
                    <p className="mt-1 text-xs leading-5 {style.body}">{insight.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickInsights;
