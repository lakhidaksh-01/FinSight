/*
 * authService
 * -----------
 * Talks to /api/auth.
 *
 * Endpoints (backend-v1/routes/authRoutes.js):
 *   POST /auth/register        { email, password }          -> { token, user }
 *   POST /auth/login           { email, password }          -> { token, user }
 *   POST /auth/forgot-password { email }                    -> { message }
 *   POST /auth/verify-otp      { email, otp }               -> { resetToken }
 *   POST /auth/reset-password  { email, resetToken, newPassword } -> { message }
 *
 * Two things the backend does that the interface has to absorb:
 *
 * 1. registerUser() only reads email and password, so the name collected on
 *    the register screen cannot be stored with this call. AuthContext applies
 *    it right after sign-up through PUT /api/profile, which does accept name.
 * 2. There is no logout or refresh endpoint. A JSON Web Token is stateless,
 *    so signing out means discarding it locally, which storage.resetSession()
 *    takes care of.
 */

import api, { unwrap, unwrapMessage } from "./api";

const RESOURCE = "/auth";

const fromAuthPayload = (payload) => {
  if (!payload) {
    return { token: null, user: null };
  }

  const user = payload.user || null;

  return {
    token: payload.token || null,
    user: user
      ? {
          id: user.id || user._id,
          name: user.name || "",
          email: user.email || "",
          currency: user.currency || "INR",
          preferences: user.preferences || {},
        }
      : null,
  };
};

export const authService = {
  /*
   * `name` is intentionally not sent: the register endpoint ignores it and the
   * profile endpoint is where the display name lives.
   */
  async register({ email, password }) {
    const response = await api.post(`${RESOURCE}/register`, {
      email: String(email || "").trim().toLowerCase(),
      password,
    });

    return {
      ...fromAuthPayload(unwrap(response)),
      message: unwrapMessage(response, "Account created successfully"),
    };
  },

  async login({ email, password }) {
    const response = await api.post(`${RESOURCE}/login`, {
      email: String(email || "").trim().toLowerCase(),
      password,
    });

    return {
      ...fromAuthPayload(unwrap(response)),
      message: unwrapMessage(response, "Signed in successfully"),
    };
  },

  /*
   * The API always answers with the same message whether or not the address is
   * registered, which is deliberate (no account enumeration). The page shows
   * the returned text as-is.
   */
  async forgotPassword(email) {
    const response = await api.post(`${RESOURCE}/forgot-password`, {
      email: String(email || "").trim().toLowerCase(),
    });

    return {
      message: unwrapMessage(
        response,
        "If an account with that email exists, an OTP has been sent."
      ),
    };
  },

  async verifyOtp({ email, otp }) {
    const response = await api.post(`${RESOURCE}/verify-otp`, {
      email: String(email || "").trim().toLowerCase(),
      otp: String(otp || "").trim(),
    });

    return {
      resetToken: unwrap(response)?.resetToken || null,
      message: unwrapMessage(response, "OTP verified successfully"),
    };
  },

  async resetPassword({ email, resetToken, newPassword }) {
    const response = await api.post(`${RESOURCE}/reset-password`, {
      email: String(email || "").trim().toLowerCase(),
      resetToken,
      newPassword,
    });

    return {
      message: unwrapMessage(response, "Password reset successfully"),
    };
  },
};

export default authService;