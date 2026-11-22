export default function MetricCard({ label, value, detail, icon: Icon, tone = "mint" }) {
  const tones = {
    mint: "text-[#a5d9ad] bg-[#9bd3a9]/10",
    amber: "text-[#e2bc85] bg-[#d5a96d]/10",
    blue: "text-[#9bc4dc] bg-[#72a8c3]/10",
    rose: "text-[#e3a39b] bg-[#cc796e]/10",
  };

  return (
    <article className="group min-w-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
          <p className="mt-2 truncate text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">{value}</p>
        </div>
        {Icon && <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone] || tones.mint}`}><Icon size={17} /></span>}
      </div>
      {detail && <p className="mt-2 text-xs text-[var(--text-muted)]">{detail}</p>}
    </article>
  );
}