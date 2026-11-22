import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

function CategoryChart({ data = [], title = "Spending by Category", description = "Understand where your money is going." }) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
          <PieChartIcon size={18} />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <div className="h-[340px] w-full" role="img" aria-label={`${title}. ${data.length ? `${data.length} categories shown.` : "No data available."}`}>
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--surface-raised)]/50 text-sm text-[var(--text-muted)]">
            No category data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`category-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [formatCurrency(Number(value) || 0), "Spending"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--surface-elevated)",
                  color: "var(--text-primary)",
                }}
              />

              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
                verticalAlign="bottom"
                align="center"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default CategoryChart;
