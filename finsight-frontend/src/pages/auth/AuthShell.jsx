import { ArrowLeft, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/app";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(112,190,137,0.12),transparent_38%),radial-gradient(ellipse_at_90%_90%,rgba(194,154,84,0.08),transparent_38%)]" />
      <section className="relative w-full max-w-[440px]">
        <Link to={ROUTES.LANDING} className="mb-9 inline-flex items-center gap-3 text-[var(--text-primary)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9bd3a9] text-[#112018]"><Wallet size={20} /></span>
          <span className="text-lg font-semibold">FinSight</span>
        </Link>
        <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface)]/95 p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:p-8">
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--text-primary)]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
        <Link to={ROUTES.LANDING} className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-primary)]">
          <ArrowLeft size={15} /> Back to FinSight
        </Link>
      </section>
    </main>
  );
}