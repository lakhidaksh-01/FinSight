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
  const { logout } = useAuth();
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
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-[var(--accent-soft)] text-[var(--text-primary)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--accent)]/20"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
            }`
          }
        >
          <Icon size={19} strokeWidth={1.8} className="shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <span>{item.label}</span>
        </NavLink>
      );
    });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-[var(--border-subtle)] bg-[var(--surface)]/80 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex h-20 items-center border-b border-[var(--border-subtle)] px-6 bg-[var(--surface)]/95 backdrop-blur-md sticky top-0 z-10">
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

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Overview</p>
          <div className="space-y-1">{renderNavigation(mainNavigation)}</div>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Intelligence</p>
          <div className="space-y-1">{renderNavigation(intelligenceNavigation)}</div>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Account</p>
          <div className="space-y-1">{renderNavigation(accountNavigation)}</div>
        </div>
      </nav>

      <div className="border-t border-[var(--border-subtle)] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-[var(--text-muted)] transition-all duration-200 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
        >
          <LogOut size={19} strokeWidth={1.8} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
