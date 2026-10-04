import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Plus,
  Target,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

/*
 * QuickActions
 * ------------
 * Provides fast access to common financial actions.
 *
 * These links take the user to the relevant page.
 * The actual forms remain inside the feature pages.
 */
const actions = [
  {
    label: "Add Expense",
    description: "Record spending",
    path: "/app/expenses",
    icon: ArrowDownToLine,
    style: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    label: "Add Income",
    description: "Record earnings",
    path: "/app/income",
    icon: ArrowUpFromLine,
    style: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  },
  {
    label: "Create Budget",
    description: "Set a spending limit",
    path: "/app/budgets",
    icon: WalletCards,
    style: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  },
  {
    label: "New Goal",
    description: "Start saving",
    path: "/app/goals",
    icon: Target,
    style: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  },
];

function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-slate-900">
          Quick Actions
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          Manage your finances faster
        </p>
      </div>

      {/* Actions */}
      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.path}
              to={action.path}
              state={{ openForm: action.path.split("/").at(-1) }}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${action.style}`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-700">
                  {action.label}
                </p>

                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  {action.description}
                </p>
              </div>

              <Plus
                size={15}
                className="text-slate-300 transition-all group-hover:rotate-90 group-hover:text-blue-500"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
