import { ArrowLeft, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/app";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-[var(--accent-glass)] blur-[100px] mixed-blend-mode-plus-lighter" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-[var(--secondary-soft)] blur-[100px] mixed-blend-mode-plus-lighter" />
      </div>

      <section className="relative w-full max-w-[440px]">
        <Link
          to={ROUTES.LANDING}
          className="mb-9 inline-flex items-center gap-3 text-[var(--text-primary)]"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/25"
          >
            <Wallet size={20} />
          </span>
          <span className="text-lg font-semibold tracking-tight">FinSight</span>
        </Link>

        <div className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl sm:p-8">
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>

        <Link
          to={ROUTES.LANDING}
          className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={15} /> Back to FinSight
        </Link>
      </section>
    </main>
  );
}
