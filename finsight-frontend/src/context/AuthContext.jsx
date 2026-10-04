/*
 * AuthContext
 * -----------
 * Owns the session for the whole application.
 *
 * Flow
 *   Auth pages -> useAuth() -> AuthContext -> authService / profileService
 *
 * What lives here
 *   - the bearer token and the cached user record (utils/storage)
 *   - login, register, logout and the three step password reset
 *   - the bootstrap check that decides on first paint whether the stored
 *     token is still usable
 *   - the reaction to an expired token reported by services/api.js
 *
 * Notes on the backend behaviour this file absorbs
 *   - POST /api/auth/register only reads email and password, so the display
 *     name is saved afterwards with PUT /api/profile. If that call fails the
 *     account still works, only the name is missing, so it is not fatal
 *   - there is no logout endpoint: a JSON Web Token is stateless, therefore
 *     signing out means dropping it locally
 *   - the password reset hand-off (email + resetToken) has to survive the
 *     jump from /verify-otp to /reset-password, so it is kept in storage
 */

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { UNAUTHORIZED_EVENT } from "../constants/app";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";
import {
  clearSession,
  getCachedUser,
  getPreferences,
  getResetSession,
  getToken,
  setCachedUser,
  setPreferences,
  setResetSession,
  setToken,
} from "../utils/storage";

export const AuthContext = createContext(null);

/*
 * Keeps the currency preference readable by formatCurrency() in sync with the
 * signed-in profile.
 */
const syncPreferences = (user) => {
  if (!user) {
    return;
  }

  setPreferences({
    ...getPreferences(),
    ...(user.preferences || {}),
    ...(user.currency ? { currency: user.currency } : {}),
  });
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getToken() ? getCachedUser() : null);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState(null);

  /*
   * Stores a token plus its user record everywhere it is needed.
   */
  const applySession = useCallback((token, nextUser) => {
    setToken(token);
    setCachedUser(nextUser);
    syncPreferences(nextUser);
    setUser(nextUser || null);
  }, []);

  const endSession = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  /*
   * Bootstrap: a stored token is trusted only after the profile request
   * succeeds, which is also what brings the latest name and currency back.
   */
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      if (!getToken()) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await profileService.getProfile();

        if (!active) {
          return;
        }

        setCachedUser(profile);
        syncPreferences(profile);
        setUser(profile);
      } catch (bootstrapError) {
        if (active) {
          endSession();
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [endSession]);

  /*
   * services/api.js broadcasts this when the API rejects the token, so the
   * interface never keeps showing data behind a dead session.
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleUnauthorized = () => {
      setError("Your session has expired. Please sign in again.");
      endSession();
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [endSession]);

  const clearError = useCallback(() => setError(null), []);

  const run = useCallback(async (action) => {
    setAuthenticating(true);
    setError(null);

    try {
      return await action();
    } catch (actionError) {
      setError(actionError?.message || "Something went wrong. Please try again.");

      throw actionError;
    } finally {
      setAuthenticating(false);
    }
  }, []);

  /*
   * Reloads the profile after a successful sign in so the topbar and profile
   * page show the stored name instead of the trimmed login payload.
   */
  const refreshProfile = useCallback(async () => {
    if (!getToken()) {
      return null;
    }

    try {
      const profile = await profileService.getProfile();

      setCachedUser(profile);
      syncPreferences(profile);
      setUser(profile);

      return profile;
    } catch (profileError) {
      return null;
    }
  }, []);

  const login = useCallback(
    async (credentials) => {
      return run(async () => {
        const { token, user: signedIn } = await authService.login(credentials);

        applySession(token, signedIn);

        return (await refreshProfile()) || signedIn;
      });
    },
    [applySession, refreshProfile, run]
  );

  const register = useCallback(
    async ({ name, email, password } = {}) => {
      return run(async () => {
        const { token, user: created } = await authService.register({
          email,
          password,
        });

        applySession(token, created);

        if (!name) {
          return created;
        }

        /*
         * The register endpoint does not persist a name, so it is written to
         * the profile straight after the session exists. A failure here must
         * not undo a successful sign-up.
         */
        try {
          const { profile } = await profileService.updateProfile({ name });

          setCachedUser(profile);
          setUser(profile);

          return profile;
        } catch (nameError) {
          return created;
        }
      });
    },
    [applySession, run]
  );

  const logout = useCallback(() => {
    endSession();
    setError(null);
  }, [endSession]);

  /*
   * Merge a locally updated profile (used by the profile page after a save).
   */
  const updateUser = useCallback((nextUser) => {
    setUser(nextUser);
    setCachedUser(nextUser);
    syncPreferences(nextUser);
  }, []);

  const forgotPassword = useCallback(
    async (email) => {
      return run(async () => {
        const result = await authService.forgotPassword(email);

        setResetSession({
          email: String(email || "").trim().toLowerCase(),
          requestedAt: new Date().toISOString(),
        });

        return result;
      });
    },
    [run]
  );

  const verifyOtp = useCallback(
    async ({ email, otp } = {}) => {
      return run(async () => {
        const { resetToken, message } = await authService.verifyOtp({
          email,
          otp,
        });

        setResetSession({
          email: String(email || "").trim().toLowerCase(),
          resetToken,
          requestedAt: getResetSession()?.requestedAt || new Date().toISOString(),
        });

        return { resetToken, message };
      });
    },
    [run]
  );

  const resetPassword = useCallback(
    async ({ email, resetToken, newPassword } = {}) => {
      return run(async () => {
        const stored = getResetSession() || {};

        const result = await authService.resetPassword({
          email: email || stored.email,
          resetToken: resetToken || stored.resetToken,
          newPassword,
        });

        setResetSession(null);
        endSession();

        return result;
      });
    },
    [endSession, run]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      authenticating,
      error,
      isAuthenticated: Boolean(user),
      resetSession: getResetSession(),
      login,
      register,
      logout,
      refreshProfile,
      updateUser,
      forgotPassword,
      verifyOtp,
      resetPassword,
      clearError,
    }),
    [
      user,
      loading,
      authenticating,
      error,
      login,
      register,
      logout,
      refreshProfile,
      updateUser,
      forgotPassword,
      verifyOtp,
      resetPassword,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;