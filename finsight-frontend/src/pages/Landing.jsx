import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, ShieldCheck, WalletCards } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/app";
import { motion } from "motion/react";

function Landing() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] h-[50%] w-[50%] rounded-full bg-[var(--accent-glass)] blur-[120px] mixed-blend-mode-plus-lighter" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[50%] w-[50%] rounded-full bg-[var(--secondary-soft)] blur-[120px] mixed-blend-mode-plus-lighter" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Link to={ROUTES.LANDING} className="flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/25">
            <WalletCards size={19} />
          </span>
          FinSight
        </Link>
        <nav className="flex items-center gap-2 sm:gap-5">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Sign in
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--accent-strong)] hover:shadow-[var(--shadow-md)]"
          >
            Create account
          </Link>
        </nav>
      </header>

      <section
        className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-24 pt-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:pb-32 lg:pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative z-10 max-w-xl"
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            A calmer way to manage money
          </p>
          <h1 className="max-w-[640px] text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--text-primary)]">
            Your money,<br />
            <span className="text-[var(--accent)]">in better focus.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
            See where it goes, plan what matters, and make your next financial
            decision with confidence.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--accent-strong)] hover:shadow-[var(--shadow-md)]"
            >
              Start tracking <ArrowRight size={17} />
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex h-12 items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text-primary)] transition-all hover:bg-[var(--surface-raised)]"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={15} className="text-[var(--accent)]" />
              Private to your account
            </span>
            <span className="inline-flex items-center gap-2">
              <BarChart3 size={15} className="text-[var(--accent)]" />
              Insights from your activity
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[640px] lg:ml-auto"
        >
          <div className="absolute -inset-2 rounded-[22px] bg-[var(--gradient-primary)] blur-[60px] opacity-50" />
          <div className="relative rotate-[1deg] rounded-[22px] border border-[var(--border-subtle)] bg-[var(--surface)] p-4 shadow-[var(--shadow-lg)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <p className="text-xs text-[var(--text-muted)]">SAMPLE OVERVIEW</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                  September, 2026
                </h2>
              </div>
              <span className="rounded-lg border border-[var(--border-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)]">Monthly</span>
            </div>
            <div className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[var(--surface-raised)] p-3.5">
                <p className="text-xs text-[var(--text-muted)]">Income</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">₹84,500</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--success)]">
                  <ArrowUpRight size={13} /> 8.2%
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-raised)] p-3.5">
                <p className="text-xs text-[var(--text-muted)]">Expenses</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">₹52,240</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <ArrowDownRight size={13} /> 3.1%
                </p>
              </div>
              <div className="col-span-2 rounded-2xl bg-[var(--surface-raised)] p-3.5 sm:col-span-1">
                <p className="text-xs text-[var(--text-muted)]">Saved this month</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[var(--text-primary)] numeric">₹32,260</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">38% of income</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">Cash flow</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">Income and expenses over time</p>
                </div>
                <span className="text-xs text-[var(--accent)]">Last 6 months</span>
              </div>
              <div className="mt-5 flex h-32 items-end gap-2 border-b border-l border-[var(--border-subtle)] px-2 sm:gap-3">
                {[48, 65, 52, 79, 68, 92, 75, 100, 66, 84, 72, 94].map((height, index) => (
                  <div
                    key={index}
                    className="relative flex h-full flex-1 items-end gap-0.5"
                  >
                    <span
                      className="w-1/2 rounded-t-sm bg-[var(--success)]/70"
                      style={{ height: `${height}%` }}
                    />
                    <span
                      className="w-1/2 rounded-t-sm bg-[var(--warning)]/60"
                      style={{ height: `${Math.max(height * 0.57, 18)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-[11px] text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                  Income
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
                  Expenses
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-[var(--border-subtle)] bg-[var(--surface-raised)]/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8">
          {[
            ["Track clearly", "Keep income and expenses organized in one place."],
            ["Plan ahead", "Set monthly budgets and measurable savings goals."],
            ["Learn from trends", "Use analytics and forecasts to spot what is changing."],
          ].map(([title, text], index) => (
            <article
              key={title}
              className="flex gap-4 border-b border-[var(--border-subtle)] pb-6 last:border-0 sm:border-b-0 sm:border-r sm:pb-0 sm:last:border-r-0"
            >
              <span className="pt-0.5 text-xs text-[var(--accent)]">
                0{index + 1}
              </span>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
                  {title}
                </h2>
                <p className="mt-1.5 max-w-xs text-sm leading-6 text-[var(--text-muted)]">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl items-center justify-between px-5 py-8 text-xs text-[var(--text-muted)] sm:px-8">
        <span>FinSight · Personal finance, with perspective.</span>
        <Link to={ROUTES.REGISTER} className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
          Get started <ArrowRight size={13} className="ml-1 inline" />
        </Link>
      </footer>
    </main>
  );
}

export default Landing;
