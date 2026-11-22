import { useState } from "react";
import { Menu, Search, Wallet } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/*
 * Topbar
 * ------
 * Global top navigation for the authenticated application.
 */
function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState(location.state?.search || "");

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) {
      navigate("/app/expenses", { state: { search: query } });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] lg:hidden"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          <div className="lg:hidden">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-inverse)] shadow-lg shadow-[var(--accent)]/20">
                <Wallet size={19} strokeWidth={2.2} />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">FinSight</span>
            </Link>
          </div>

          <form onSubmit={submitSearch} className="relative hidden md:block lg:ml-2">
            <Search size={17} strokeWidth={1.8} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expenses…"
              aria-label="Search expenses"
              className="h-11 w-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/20 lg:w-80"
            />
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/app/profile"
            aria-label="Open profile"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all hover:bg-[var(--surface-raised)]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-[var(--text-inverse)] text-sm font-bold shadow-lg shadow-[var(--accent)]/20">
              {(user?.name || user?.email || "F")
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-[var(--text-primary)]">
                {user?.name || "Your account"}
              </p>
              <p className="max-w-40 truncate text-xs text-[var(--text-muted)]">
                {user?.email || "Personal account"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
