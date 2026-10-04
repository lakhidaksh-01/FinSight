import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/*
 * Breadcrumbs
 * -----------
 * Displays the user's current location inside FinSight.
 *
 * Example:
 *
 * <Breadcrumbs
 *   items={[
 *     { label: "Expenses", path: "/app/expenses" },
 *     { label: "Edit Expense" }
 *   ]}
 * />
 */

function Breadcrumbs({ items = [] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-5 flex items-center overflow-x-auto"
    >
      <ol className="flex items-center whitespace-nowrap">
        {/* Home */}
        <li className="flex items-center">
          <Link
            to="/app/dashboard"
            aria-label="Dashboard"
            className="flex items-center text-slate-500 transition-colors hover:text-white"
          >
            <Home size={15} strokeWidth={1.8} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {/* Separator */}
              <ChevronRight
                size={14}
                strokeWidth={1.7}
                className="mx-2 shrink-0 text-slate-700"
              />

              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-xs font-medium text-slate-500 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-xs font-medium ${
                    isLast ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
