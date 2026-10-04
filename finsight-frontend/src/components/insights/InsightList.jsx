import { Sparkles } from "lucide-react";
import InsightCard from "./InsightCard";
import EmptyState from "../common/EmptyState";

function InsightList({
  insights = [],
  onAction,
  title = "Your Insights",
}) {
  if (!insights.length) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No insights available"
        description="As FinSight gathers more financial data, useful patterns and insights will appear here."
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <Sparkles size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Highlights generated from your financial activity
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {insights.map((insight, index) => (
          <InsightCard
            key={insight.id || insight._id || index}
            insight={insight}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
}

export default InsightList;
