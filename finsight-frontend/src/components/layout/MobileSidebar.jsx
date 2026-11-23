import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { X, LayoutDashboard, WalletCards, ArrowDownToLine, ArrowUpFromLine, Target, BarChart3, Sparkles, UserRound, Wallet, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/app";

/*
 * MobileSidebar
 * -------------
 * Mobile navigation drawer.
 */

const navigation = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Expenses", path: ROUTES.EXPENSES, icon: ArrowDownToLine },
  { label: "Income", path: ROUTES.INCOME, icon: ArrowUpFromLine },
  { label: "Budgets", path: ROUTES.BUDGETS, icon: WalletCards },
  { label: "Goals", path: ROUTES.GOALS, icon: Target },
  { label: "Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "Predictions", path: ROUTES.PREDICTIONS, icon: Sparkles },
  { label: "Profile", path: ROUTES.PROFILE, icon: UserRound },
];

function MobileSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
      />

      <aside role="dialog" aria-modal="true" aria-label="Mobile navigation" className="relative flex h-full w-[290px] max-w-[85vw] flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
        <div className="flex h-20 items-center justify-between border-b border-[var(--border-subtle)] px-5 bg-[var(--surface)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/20">
              <Wallet size={21} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-[var(--text-primary)]">FinSight</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">Financial Intelligence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Navigation</p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)] ring-1 ring-[var(--accent)]/15"
                      : "font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <span className={`absolute left-0 h-5 w-0.5 rounded-r-full bg-[var(--accent)] transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
                      <Icon
                        size={18}
                        strokeWidth={1.8}
                        className={isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[var(--border-subtle)] p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-[var(--text-inverse)] text-sm font-bold shadow-lg shadow-[var(--accent)]/20">
              {(user?.name || user?.email || "F").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user?.name || user?.email || "Your account"}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{user?.email || "Personal account"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { logout(); onClose(); navigate(ROUTES.LOGIN, { replace: true }); }}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
    </div>
  );
}

export default MobileSidebar;
