import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PiggyBank } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function SavingsChart({ data = [], title = "Savings Trend", description = "See how your savings are developing over time." }) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <PiggyBank size={18} />
        </div>
        <div>
          <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>
        </div>
      </div>

      <div className="h-[310px] w-full">
        {!data.length ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--surface-raised)]/50 text-sm text-[var(--text-muted)]">
            No savings data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 14, right: 14, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value) || 0), "Savings"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-lg)",
                  background: "var(--surface-elevated)",
                  color: "var(--text-primary)",
                }}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--chart-3)"
                strokeWidth="3"
                fill="url(#savingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default SavingsChart;
