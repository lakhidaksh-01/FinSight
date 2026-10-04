import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/*
 * Topbar
 * ------
 * Global top navigation used across the authenticated application.
 *
 * Desktop:
 * - Search
 * - User profile
 *
 * Mobile:
 * - Menu button
 * - FinSight branding
 * - User profile
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
      navigate("/app/expenses", {
        state: { search: query },
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left side */}
        <div className="flex items-center gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition-all hover:bg-white/[0.07] hover:text-white lg:hidden"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden">
            <p className="text-lg font-bold tracking-tight text-white">
              FinSight
            </p>
          </div>

          {/* Desktop search */}
          <form
            onSubmit={submitSearch}
            className="relative hidden md:block lg:ml-2"
          >
            <Search
              size={17}
              strokeWidth={1.8}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expenses..."
              aria-label="Search expenses"
              className="h-11 w-64 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition-all focus:border-white/20 focus:bg-white/[0.05] lg:w-80"
            />
          </form>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/app/profile"
            aria-label="Open profile"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all hover:bg-white/[0.05]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
              {(user?.name || user?.email || "F")
                .slice(0, 1)
                .toUpperCase()}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-40 truncate text-sm font-semibold text-white">
                {user?.name || "Your account"}
              </p>

              <p className="max-w-40 truncate text-xs text-slate-500">
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