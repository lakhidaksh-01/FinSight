/*
 * App
 * ---
 * Application-wide constants.
 *
 * Route strings live here so pages, hooks and navigation never
 * hard-code paths independently.
 */

export const APP_NAME = "FinSight";

export const APP_TAGLINE = "Financial Intelligence";

export const APP_DESCRIPTION =
  "Track spending, plan income, control budgets and forecast what is coming next.";

/*
 * Routes
 *
 * Public routes are reachable without an account.
 * Everything under /app is protected by ProtectedRoute.
 */
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  RESET_PASSWORD: "/reset-password",

  APP: "/app",
  DASHBOARD: "/app/dashboard",
  EXPENSES: "/app/expenses",
  INCOME: "/app/income",
  BUDGETS: "/app/budgets",
  GOALS: "/app/goals",
  ANALYTICS: "/app/analytics",
  PREDICTIONS: "/app/predictions",
  PROFILE: "/app/profile",
};

/*
 * Storage keys
 *
 * Centralised so utils/storage and the API client never drift apart.
 */
export const STORAGE_KEYS = {
  TOKEN: "finsight.token",
  USER: "finsight.user",
  PREFERENCES: "finsight.preferences",
  RESET_SESSION: "finsight.passwordReset",
};

/*
 * Broadcast when the API rejects the stored token.
 * AuthContext listens for it and ends the session.
 */
export const UNAUTHORIZED_EVENT = "finsight:unauthorized";

export const DEFAULT_CURRENCY = "INR";

export const CURRENCIES = [
  { value: "INR", label: "Indian Rupee", symbol: "\u20B9", locale: "en-IN" },
  { value: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { value: "CAD", label: "Canadian Dollar", symbol: "C$", locale: "en-CA" },
  { value: "EUR", label: "Euro", symbol: "\u20AC", locale: "de-DE" },
  { value: "GBP", label: "British Pound", symbol: "\u00A3", locale: "en-GB" },
];

/*
 * Analytics ranges
 *
 * The analytics page and charts always work on a rolling window
 * of whole months so comparisons stay meaningful.
 */
export const ANALYTICS_PERIODS = [
  { value: 3, label: "Last 3 months" },
  { value: 6, label: "Last 6 months" },
  { value: 12, label: "Last 12 months" },
];

export const DEFAULT_ANALYTICS_MONTHS = 6;

/*
 * Prediction ranges
 *
 * Predictions are generated locally from the user's own history and
 * then stored through POST /api/predictions so they appear in history.
 */
export const PREDICTION_PERIODS = [
  { value: 1, label: "Next 1 month" },
  { value: 3, label: "Next 3 months" },
  { value: 6, label: "Next 6 months" },
];

export const DEFAULT_PREDICTION_MONTHS = 3;

export const PREDICTION_TYPES = {
  MONTHLY_SPENDING: "monthly_spending",
  MONTHLY_SAVINGS: "monthly_savings",
};

export const PREDICTION_MODEL_LABEL = "FinSight Trend Engine";

/*
 * Budget warning thresholds (mirrored by BudgetWarnings.jsx).
 */
export const BUDGET_THRESHOLDS = {
  WARNING: 80,
  EXCEEDED: 100,
};

/*
 * Risk thresholds (mirrored by the API service riskService.js).
 */
export const RISK_THRESHOLDS = {
  HIGH_SAVINGS_RATE: 10,
  MEDIUM_SAVINGS_RATE: 20,
};

/*
 * Minimum history required before forecasts are trusted.
 */
export const MIN_MONTHS_FOR_FORECAST = 3;