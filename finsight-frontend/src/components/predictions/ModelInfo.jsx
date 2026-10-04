import {
  BrainCircuit,
  Database,
  Activity,
  ShieldCheck,
} from "lucide-react";

function ModelInfo({
  modelName = "FinSight Prediction Engine",
  modelVersion = "Current",
  dataPoints = null,
  confidence = null,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/40 p-6 shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-200/40">
            <BrainCircuit size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              Intelligence Engine
            </p>

            <h3 className="mt-1 font-semibold text-slate-900">
              {modelName}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {modelVersion}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white bg-white/80 p-4">
            <Database size={17} className="text-blue-600" />

            <p className="mt-3 text-xs text-slate-500">
              Data points
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {dataPoints !== null ? dataPoints : "Available"}
            </p>
          </div>

          <div className="rounded-xl border border-white bg-white/80 p-4">
            <Activity size={17} className="text-purple-600" />

            <p className="mt-3 text-xs text-slate-500">
              Confidence
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {confidence !== null
                ? `${Number(confidence).toFixed(0)}%`
                : "Dynamic"}
            </p>
          </div>

          <div className="rounded-xl border border-white bg-white/80 p-4">
            <ShieldCheck size={17} className="text-emerald-600" />

            <p className="mt-3 text-xs text-slate-500">
              Processing
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              Personal data
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          Predictions are generated from the financial information available
          in your FinSight account. Forecasts are estimates and should be
          treated as informational rather than guaranteed outcomes.
        </p>
      </div>
    </div>
  );
}

export default ModelInfo;
