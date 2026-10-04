import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, ShieldCheck, WalletCards } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/app";

function Landing() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return (
    <main className="min-h-screen overflow-hidden bg-[#0c1210] text-[#f1f5f2]">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to={ROUTES.LANDING} className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9bd3a9] text-[#112018]"><WalletCards size={19} /></span> FinSight
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5">
          <Link to={ROUTES.LOGIN} className="px-3 py-2 text-sm text-[#bac4bd] transition hover:text-white">Sign in</Link>
          <Link to={ROUTES.REGISTER} className="rounded-lg bg-[#9bd3a9] px-4 py-2.5 text-sm font-semibold text-[#132119] transition hover:bg-[#b4e4bf]">Create account</Link>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 lg:pb-28 lg:pt-14">
        <div className="relative z-10 max-w-xl animate-[rise_650ms_ease-out_both]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#9bd3a9]/20 bg-[#9bd3a9]/[0.07] px-3 py-1.5 text-xs font-medium text-[#b7dbbd]"><span className="h-1.5 w-1.5 rounded-full bg-[#9bd3a9]" /> A calmer way to manage money</p>
          <h1 className="max-w-[620px] text-[clamp(2.8rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">Your money,<br /><span className="text-[#a5d9ad]">in better focus.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#a6b2aa] sm:text-lg">See where it goes, plan what matters, and make your next financial decision with confidence.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={ROUTES.REGISTER} className="inline-flex h-12 items-center gap-2 rounded-lg bg-[#9bd3a9] px-5 text-sm font-semibold text-[#132119] transition hover:bg-[#b4e4bf]">Start tracking <ArrowRight size={17} /></Link>
            <Link to={ROUTES.LOGIN} className="inline-flex h-12 items-center rounded-lg border border-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/[0.05]">Sign in</Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#89968e]">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#9bd3a9]" /> Private to your account</span>
            <span className="inline-flex items-center gap-2"><BarChart3 size={15} className="text-[#9bd3a9]" /> Insights from your activity</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] animate-[rise_800ms_120ms_ease-out_both] lg:ml-auto">
          <div className="absolute -inset-10 rounded-full bg-[#75ad85]/[0.08] blur-3xl" />
          <div className="relative rotate-[1deg] rounded-[18px] border border-white/10 bg-[#111a16] p-4 shadow-2xl shadow-black/40 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <div><p className="text-xs text-[#8d9a91]">SAMPLE OVERVIEW</p><h2 className="mt-1 text-lg font-semibold">September, 2026</h2></div>
              <span className="rounded-md border border-white/10 px-2.5 py-1.5 text-xs text-[#bac4bd]">Monthly</span>
            </div>
            <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#19231e] p-3.5"><p className="text-xs text-[#93a097]">Income</p><p className="mt-2 text-lg font-semibold">₹84,500</p><p className="mt-1 flex items-center gap-1 text-xs text-[#a5d9ad]"><ArrowUpRight size={13} /> 8.2%</p></div>
              <div className="rounded-xl bg-[#19231e] p-3.5"><p className="text-xs text-[#93a097]">Expenses</p><p className="mt-2 text-lg font-semibold">₹52,240</p><p className="mt-1 flex items-center gap-1 text-xs text-[#d9ae78]"><ArrowDownRight size={13} /> 3.1%</p></div>
              <div className="col-span-2 rounded-xl bg-[#19231e] p-3.5 sm:col-span-1"><p className="text-xs text-[#93a097]">Saved this month</p><p className="mt-2 text-lg font-semibold">₹32,260</p><p className="mt-1 text-xs text-[#93a097]">38% of income</p></div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#151e19] p-4">
              <div className="flex items-center justify-between"><div><p className="text-sm font-medium">Cash flow</p><p className="mt-1 text-xs text-[#89968e]">Income and expenses over time</p></div><span className="text-xs text-[#9bd3a9]">Last 6 months</span></div>
              <div className="mt-5 flex h-32 items-end gap-2 border-b border-l border-white/10 px-2 sm:gap-3">
                {[48, 65, 52, 79, 68, 92, 75, 100, 66, 84, 72, 94].map((height, index) => <div key={index} className="relative flex h-full flex-1 items-end gap-0.5"><span className="w-1/2 rounded-t-sm bg-[#83bd91]/75" style={{ height: `${height}%` }} /><span className="w-1/2 rounded-t-sm bg-[#c59e69]/70" style={{ height: `${Math.max(height * 0.57, 18)}%` }} /></div>)}
              </div>
              <div className="mt-3 flex gap-4 text-[11px] text-[#89968e]"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#83bd91]" /> Income</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#c59e69]" /> Expenses</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-white/[0.07] bg-[#101713]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8">
          {[['Track clearly', 'Keep income and expenses organized in one place.'], ['Plan ahead', 'Set monthly budgets and measurable savings goals.'], ['Learn from trends', 'Use analytics and forecasts to spot what is changing.']].map(([title, text], index) => <article key={title} className="flex gap-4 border-b border-white/[0.06] pb-5 last:border-0 sm:border-b-0 sm:border-r sm:pb-0 sm:last:border-r-0"><span className="pt-0.5 text-xs text-[#9bd3a9]">0{index + 1}</span><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1.5 max-w-xs text-sm leading-6 text-[#96a39a]">{text}</p></div></article>)}
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-xs text-[#768279] sm:px-8"><span>FinSight · Personal finance, with perspective.</span><Link to={ROUTES.REGISTER} className="text-[#b7dbbd] hover:text-white">Get started <ArrowRight size={13} className="ml-1 inline" /></Link></footer>
    </main>
  );
}

export default Landing;