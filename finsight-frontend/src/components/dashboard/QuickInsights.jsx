import {
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

/*
 * QuickInsights
 * -------------
 * Shows short financial observations on the dashboard.
 *
 * This component does not create financial advice itself.
 * It simply displays insight data supplied by the page.
 *
 * Expected insight format:
 *
 * {
 *   id,
 *   type: "info" | "warning",
 *   title,
 *   message
 * }
 */
function QuickInsights({ insights = [] }) {
  const getInsightStyle = (type) => {
    if (type === "warning") {
      return {
        icon: AlertTriangle,
        iconStyle: "bg-amber-50 text-amber-600",
      };
    }

    return {
      icon: Lightbulb,
      iconStyle: "bg-purple-50 text-purple-600",
    };
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-100/70 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-purple-600">
              <Sparkles size={18} strokeWidth={1.8} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Quick Insights
              </h3>

              <p className="text-xs text-slate-400">
                Highlights from your finances
              </p>
            </div>
          </div>

          <Link
            to="/app/ai-insights"
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 transition-colors hover:text-blue-600"
          >
            Explore
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Insights */}
        <div className="mt-5 space-y-3">
          {insights.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-600">
                No insights available yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                More activity will help FinSight surface useful patterns.
              </p>
            </div>
          ) : (
            insights.slice(0, 3).map((insight, index) => {
              const style = getInsightStyle(insight.type);
              const Icon = style.icon;

              return (
                <div
                  key={insight.id || index}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.iconStyle}`}
                  >
                    <Icon size={17} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {insight.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {insight.message}
                    </p>
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