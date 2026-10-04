import { NavLink, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  WalletCards,
  ArrowDownToLine,
  ArrowUpFromLine,
  Target,
  BarChart3,
  Sparkles,
  UserRound,
  Wallet,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/app";

/*
 * MobileSidebar
 * -------------
 * Mobile navigation drawer.
 *
 * It appears when the user clicks the menu button
 * inside the Topbar.
 */

const navigation = [
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
  {
    label: "Profile",
    path: "/app/profile",
    icon: UserRound,
  },
];

function MobileSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dark overlay */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="relative flex h-full w-[290px] max-w-[85vw] flex-col border-r border-white/[0.08] bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
              <Wallet size={21} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                FinSight
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">
                Financial Intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Navigation
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white/10 text-white ring-1 ring-white/10"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User area */}
        <div className="border-t border-white/[0.07] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
              {(user?.name || user?.email || "F").slice(0, 1).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || user?.email || "Your account"}
              </p>

              <p className="truncate text-xs text-slate-500">{user?.email || "Personal account"}</p>
            </div>
          </div>
          <button type="button" onClick={() => { logout(); onClose(); navigate(ROUTES.LOGIN, { replace: true }); }} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300"><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
    </div>
  );
}

export default MobileSidebar;
