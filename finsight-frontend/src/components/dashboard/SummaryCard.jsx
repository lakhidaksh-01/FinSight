import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

/*
 * SummaryCard
 * -----------
 * Reusable financial summary card.
 */
function SummaryCard({ title, value, change, changeType = "neutral", icon: Icon, description }) {
  const changeStyles = {
    positive: "text-[var(--success)] bg-[var(--success-soft)]",
    negative: "text-[var(--danger)] bg-[var(--danger-soft)]",
    neutral: "text-[var(--text-muted)] bg-[var(--surface-raised)]",
  };

  const ChangeIcon =
    changeType === "positive"
      ? ArrowUpRight
      : changeType === "negative"
        ? ArrowDownRight
        : Minus;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-1 sm:p-6">
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)] numeric sm:text-3xl">{value}</h3>
          </div>

          {Icon && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Icon size={20} strokeWidth={1.9} />
            </div>
          )}
        </div>

        {(change || description) && (
          <div className="mt-4 flex items-center gap-2">
            {change && (
              <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${changeStyles[changeType] || changeStyles.neutral}`}>
                <ChangeIcon size={13} strokeWidth={2} />
                {change}
              </span>
            )}

            {description && (
              <span className="text-xs text-[var(--text-muted)]">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
