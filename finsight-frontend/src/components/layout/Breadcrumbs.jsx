import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/*
 * Breadcrumbs
 * -----------
 * Displays the user's current location inside FinSight.
 */
function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center overflow-x-auto">
      <ol className="flex items-center whitespace-nowrap gap-1">
        <li className="flex items-center">
          <Link
            to="/app/dashboard"
            aria-label="Dashboard"
            className="flex items-center text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <Home size={15} strokeWidth={1.8} />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <ChevronRight size={14} strokeWidth={1.7} className="shrink-0 text-[var(--text-muted)]" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`text-xs font-medium ${isLast ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
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
