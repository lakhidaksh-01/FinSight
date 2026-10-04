import {
  BrainCircuit,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function PredictionHistory({
  predictions = [],
  onSelect,
}) {
  if (!predictions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <BrainCircuit size={21} />
        </div>

        <h3 className="mt-4 font-semibold text-slate-900">
          No prediction history
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Your generated predictions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="font-semibold text-slate-900">
          Prediction History
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Previously generated financial forecasts
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {predictions.map((prediction) => {
          const id = prediction._id || prediction.id;

          const amount = Number(
            prediction.predictedAmount ??
              prediction.amount ??
              prediction.value ??
              0
          );

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect?.(prediction)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-purple-50/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <BrainCircuit size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">
                  {prediction.period || "Financial forecast"}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {prediction.createdAt && (
                    <>
                      <CalendarDays size={13} />
                      <span>{formatDate(prediction.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">
                  {formatCurrency(amount)}
                </span>

                <ChevronRight
                  size={17}
                  className="text-slate-400"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PredictionHistory;
