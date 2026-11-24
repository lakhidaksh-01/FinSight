/*
 * MetricCard
 * ----------
 * Premium financial summary card.
 *
 *   <MetricCard
 *     label="Total Income"
 *     value="₹84,500"
 *     detail="+12% vs last month"
 *     icon={ArrowUpRight}
 *     tone="success"
 *   />
 */
export default function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "primary",
}) {
  const tones = {
    primary: { icon: "bg-[var(--accent-soft)] text-[var(--accent)]" },
    success: { icon: "bg-[var(--success-soft)] text-[var(--success)]" },
    warning: { icon: "bg-[var(--warning-soft)] text-[var(--warning)]" },
    danger: { icon: "bg-[var(--danger-soft)] text-[var(--danger)]" },
    info: { icon: "bg-[var(--info-soft)] text-[var(--info)]" },
  };

  const toneStyle = tones[tone] || tones.primary;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] sm:p-5">
      {Icon && (
        <div className={`mb-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneStyle.icon}`}>
          <Icon size={17} strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--text-primary)] numeric">
          {value}
        </p>
      </div>
      {detail && (
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{detail}</p>
      )}
    </article>
  );
}
