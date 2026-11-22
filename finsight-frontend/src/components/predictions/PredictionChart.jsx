import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BrainCircuit } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/*
 * PredictionChart
 * ---------------
 * Historical vs predicted spending areas.
 */
function PredictionChart({ data = [], title = "Prediction Forecast", description = "Compare historical values with predicted values." }) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <BrainCircuit size={18} />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <div className="h-[320px] w-full">
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--surface-raised)]/50 text-sm text-[var(--text-muted)]">
            No prediction data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 14, right: 14, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="predictionHistorical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.02" />
                </linearGradient>

                <linearGradient id="predictionForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-6)" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="var(--chart-6)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />

              <Tooltip
                formatter={(value, name) => [formatCurrency(value), name === "historical" ? "Historical" : "Predicted"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--surface-elevated)",
                  color: "var(--text-primary)",
                }}
              />

              <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }} />

              <Area
                type="monotone"
                dataKey="historical"
                name="Historical"
                stroke="var(--chart-1)"
                strokeWidth="3"
                fill="url(#predictionHistorical)"
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="var(--chart-6)"
                strokeWidth="3"
                strokeDasharray="6 4"
                fill="url(#predictionForecast)"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default PredictionChart;
