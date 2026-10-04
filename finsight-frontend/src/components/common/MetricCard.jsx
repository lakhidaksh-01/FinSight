export default function MetricCard({ label, value, detail, icon: Icon, tone = "mint" }) {
  const tones = {
    mint: "text-[#a5d9ad] bg-[#9bd3a9]/10",
    amber: "text-[#e2bc85] bg-[#d5a96d]/10",
    blue: "text-[#9bc4dc] bg-[#72a8c3]/10",
    rose: "text-[#e3a39b] bg-[#cc796e]/10",
  };

  return (
    <article className="min-w-0 rounded-xl border border-white/[0.08] bg-[#121a16] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#91a097]">{label}</p>
          <p className="mt-2 truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">{value}</p>
        </div>
        {Icon && <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone] || tones.mint}`}><Icon size={17} /></span>}
      </div>
      {detail && <p className="mt-2 text-xs text-[#829087]">{detail}</p>}
    </article>
  );
}