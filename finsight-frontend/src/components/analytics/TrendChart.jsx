import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function TrendChart({
  data = [],
  title = "Financial Trends",
  description = "Compare your income, expenses and savings over time.",
}) {
  const getSeriesName = (name) => {
    if (name === "income" || name === "Income") return "Income";
    if (name === "expenses" || name === "Expenses") return "Expenses";
    if (name === "savings" || name === "Savings") return "Savings";
    return name;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-purple-600">
          <Activity size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="h-[330px] w-full">
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
            No trend data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
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
                tickFormatter={(value) => formatCurrency(value)}
              />

              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value) || 0),
                  getSeriesName(name),
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

              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#496fc4"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#a96775"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="#43806a"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TrendChart;