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

function PredictionChart({
  data = [],
  title = "Prediction Forecast",
  description = "Compare historical values with predicted values.",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <BrainCircuit size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="h-[320px] w-full">
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            No prediction data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="predictionHistorical"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#496fc4" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#496fc4" stopOpacity={0.02} />
                </linearGradient>

                <linearGradient
                  id="predictionForecast"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#7968b8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#7968b8" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value) => `₹${value}`}
              />

              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(value),
                  name === "historical" ? "Historical" : "Predicted",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                }}
              />

              <Legend
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "15px",
                  fontSize: "12px",
                }}
              />

              <Area
                type="monotone"
                dataKey="historical"
                name="Historical"
                stroke="#496fc4"
                strokeWidth={3}
                fill="url(#predictionHistorical)"
                connectNulls
              />

              <Area
                type="monotone"
                dataKey="predicted"
                name="Predicted"
                stroke="#7968b8"
                strokeWidth={3}
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
