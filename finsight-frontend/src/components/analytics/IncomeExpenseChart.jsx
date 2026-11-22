import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ArrowLeftRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function IncomeExpenseChart({ data = [], title = "Income vs Expenses", description = "Compare money coming in with money going out." }) {
  const getSeriesName = (name) => {
    if (name === "income" || name === "Income") return "Income";
    if (name === "expenses" || name === "Expenses") return "Expenses";
    return name;
  };

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <ArrowLeftRight size={18} />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <div className="h-[310px] w-full">
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--surface-raised)]/50 text-sm text-[var(--text-muted)]">
            No income or expense data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 14, right: 14, left: 0, bottom: 0 }} barGap="12%">
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

              <Bar
                dataKey="income"
                name="Income"
                fill="var(--chart-3)"
                radius={[6, 6, 0, 0]}
                maxBarSize={34}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
                maxBarSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default IncomeExpenseChart;
