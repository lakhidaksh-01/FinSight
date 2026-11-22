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

function TrendChart({ data = [], title = "Financial Trends", description = "Compare your income, expenses and savings over time." }) {
  const getSeriesName = (name) => {
    if (name === "income" || name === "Income") return "Income";
    if (name === "expenses" || name === "Expenses") return "Expenses";
    if (name === "savings" || name === "Savings") return "Savings";
    return name;
  };

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)]">
          <Activity size={18} />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <div className="h-[340px] w-full" role="img" aria-label={`${title}. ${data.length ? `${data.length} monthly periods shown.` : "No data available."}`}>
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--surface-raised)]/50 text-sm text-[var(--text-muted)]">
            No trend data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 14, right: 14, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value, name) => [formatCurrency(Number(value) || 0), getSeriesName(name)]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--surface-elevated)",
                  color: "var(--text-primary)",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }} />

              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="var(--chart-3)"
                strokeWidth="3"
                dot={false}
                activeDot={{ r: 5, fill: "var(--chart-3)", stroke: "var(--surface)" }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="var(--chart-1)"
                strokeWidth="3"
                dot={false}
                activeDot={{ r: 5, fill: "var(--chart-1)", stroke: "var(--surface)" }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="var(--chart-2)"
                strokeWidth="3"
                dot={false}
                activeDot={{ r: 5, fill: "var(--chart-2)", stroke: "var(--surface)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TrendChart;
