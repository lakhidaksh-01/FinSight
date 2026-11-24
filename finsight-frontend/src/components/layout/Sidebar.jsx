import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/app";
import {
  LayoutDashboard,
  WalletCards,
  ArrowDownToLine,
  ArrowUpFromLine,
  Target,
  BarChart3,
  Sparkles,
  UserRound,
  LogOut,
  Wallet,
  ChevronRight,
} from "lucide-react";

/*
 * Sidebar
 * -------
 * Permanent desktop navigation for FinSight.
 *
 * Hidden below lg; MobileSidebar handles smaller screens.
 */

const mainNavigation = [
  { label: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Expenses", path: ROUTES.EXPENSES, icon: ArrowDownToLine },
  { label: "Income", path: ROUTES.INCOME, icon: ArrowUpFromLine },
  { label: "Budgets", path: ROUTES.BUDGETS, icon: WalletCards },
  { label: "Goals", path: ROUTES.GOALS, icon: Target },
];

const intelligenceNavigation = [
  { label: "Analytics", path: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "Predictions", path: ROUTES.PREDICTIONS, icon: Sparkles },
];

const accountNavigation = [
  { label: "Profile", path: ROUTES.PROFILE, icon: UserRound },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const renderNavigation = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
            isActive
              ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--accent)]/15"
              : "font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          }`}
        >
          {({ isActive }) => (
            <>
              <span className={`absolute left-0 h-5 w-0.5 rounded-r-full bg-[var(--accent)] transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
              <Icon
                size={18}
                strokeWidth={1.8}
                className={`shrink-0 transition-colors ${isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"}`}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={15} className="text-[var(--accent)]/70" />}
            </>
          )}
        </NavLink>
      );
    });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[var(--border-subtle)] bg-[var(--surface)] lg:flex lg:flex-col">
      <div className="sticky top-0 z-10 flex h-16 items-center border-b border-[var(--border-subtle)] bg-[var(--surface)] px-5">
        <NavLink to="/app/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/20">
            <Wallet size={21} strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-[var(--text-primary)]">FinSight</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">Financial Intelligence</p>
          </div>
        </NavLink>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-5">
        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Overview</p>
          <div className="space-y-1">{renderNavigation(mainNavigation)}</div>
        </div>

        <div className="mt-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Intelligence</p>
          <div className="space-y-1">{renderNavigation(intelligenceNavigation)}</div>
        </div>

        <div className="mt-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Account</p>
          <div className="space-y-1">{renderNavigation(accountNavigation)}</div>
        </div>
      </nav>

      <div className="border-t border-[var(--border-subtle)] p-4">
        <div className="mb-2 flex items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]/70 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-sm font-bold text-[var(--text-inverse)] shadow-sm">
            {(user?.name || user?.email || "F").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{user?.name || "Your account"}</p>
            <p className="truncate text-xs text-[var(--text-muted)]">{user?.email || "Personal account"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
        >
          <LogOut size={18} strokeWidth={1.8} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
