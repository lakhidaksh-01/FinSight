import { BrainCircuit, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function PredictionCard({
  prediction,
  title = "Financial Prediction",
}) {
  if (!prediction) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <BrainCircuit size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              No prediction available yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const predictedAmount = Number(
    prediction.predictedAmount ??
      prediction.amount ??
      prediction.value ??
      0
  );

  const confidence = Number(prediction.confidence ?? 0);

  const trend = prediction.trend || "stable";

  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
        ? TrendingDown
        : Minus;

  const trendClasses =
    trend === "up"
      ? "bg-emerald-50 text-emerald-600"
      : trend === "down"
        ? "bg-red-50 text-red-600"
        : "bg-slate-100 text-slate-600";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-100/30">
      {/* Intelligence glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-purple-600">
              <BrainCircuit size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                AI Prediction
              </p>

              <h3 className="mt-1 font-semibold text-slate-900">
                {title}
              </h3>
            </div>
          </div>

          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${trendClasses}`}
          >
            <TrendIcon size={17} />
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Predicted Amount
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatCurrency(predictedAmount)}
          </p>
        </div>

        {prediction.period && (
          <p className="mt-2 text-sm text-slate-500">
            Forecast for {prediction.period}
          </p>
        )}

        {confidence > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Model confidence
              </span>

              <span className="font-semibold text-purple-600">
                {confidence.toFixed(0)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{
                  width: `${Math.min(Math.max(confidence, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionCard;
