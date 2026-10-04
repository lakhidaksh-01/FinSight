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
 * Permanent desktop navigation for the FinSight application.
 *
 * The sidebar is hidden on smaller screens.
 * MobileSidebar handles mobile navigation separately.
 */

const mainNavigation = [
  {
    label: "Dashboard",
    path: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Expenses",
    path: "/app/expenses",
    icon: ArrowDownToLine,
  },
  {
    label: "Income",
    path: "/app/income",
    icon: ArrowUpFromLine,
  },
  {
    label: "Budgets",
    path: "/app/budgets",
    icon: WalletCards,
  },
  {
    label: "Goals",
    path: "/app/goals",
    icon: Target,
  },
];

const intelligenceNavigation = [
  {
    label: "Analytics",
    path: "/app/analytics",
    icon: BarChart3,
  },
  {
    label: "Predictions",
    path: "/app/predictions",
    icon: Sparkles,
  },
];

const accountNavigation = [
  {
    label: "Profile",
    path: "/app/profile",
    icon: UserRound,
  },
];

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const renderNavigation = (items) => {
    return items.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
            }`
          }
        >
          <Icon
            size={19}
            strokeWidth={1.8}
            className="shrink-0 transition-transform duration-200 group-hover:scale-105"
          />

          <span>{item.label}</span>
        </NavLink>
      );
    });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/[0.07] bg-slate-950/95 backdrop-blur-xl lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-white/[0.07] px-6">
        <NavLink to="/app/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg shadow-white/5">
            <Wallet size={21} strokeWidth={2.2} />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              FinSight
            </p>

            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Financial Intelligence
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {/* Main */}
        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Overview
          </p>

          <div className="space-y-1">
            {renderNavigation(mainNavigation)}
          </div>
        </div>

        {/* Intelligence */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Intelligence
          </p>

          <div className="space-y-1">
            {renderNavigation(intelligenceNavigation)}
          </div>
        </div>

        {/* Account */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Account
          </p>

          <div className="space-y-1">
            {renderNavigation(accountNavigation)}
          </div>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/[0.07] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut
            size={19}
            strokeWidth={1.8}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />

          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
