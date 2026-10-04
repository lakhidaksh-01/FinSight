import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

/*
 * ProtectedRoute
 * --------------
 * Prevents unauthenticated users from accessing
 * private FinSight pages.
 *
 * Authentication is handled through AuthContext/useAuth.
 *
 * If authentication is still loading:
 *     Show loading screen.
 *
 * If user is not authenticated:
 *     Redirect to login.
 *
 * If user is authenticated:
 *     Render the requested page.
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until authentication status is known.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <LoadingSpinner
          size="large"
          text="Loading FinSight..."
        />
      </div>
    );
  }

  // Redirect unauthenticated users to login.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Render protected child routes.
  return <Outlet />;
}

export default ProtectedRoute;
