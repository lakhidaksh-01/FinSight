/*
 * api
 * ---
 * The single HTTP entry point of the application.
 *
 * Nothing outside src/services is allowed to talk to the backend, and pages
 * never import this file directly: Pages -> Hooks -> Services -> api.js.
 *
 * Responsibilities:
 * - base URL from VITE_API_BASE_URL (defaults to the "/api" dev proxy)
 * - attach the bearer token stored by utils/storage
 * - unwrap the backend envelope { success, message, data }
 * - normalise every failure into an ApiError with a readable message
 * - broadcast an unauthorized event so AuthContext can end the session
 */

import axios from "axios";
import { UNAUTHORIZED_EVENT } from "../constants/app";
import { clearSession, getToken } from "../utils/storage";

/*
 * With no environment variable the client uses the relative "/api" prefix,
 * which vite.config.js proxies to the Express server. That keeps browser
 * requests same-origin and avoids CORS during local development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/*
 * Errors the UI can render without inspecting axios internals.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, errors = null, fieldErrors = null, data = null } = {}) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.fieldErrors = fieldErrors;
    this.data = data;
  }
}

export const NETWORK_ERROR_MESSAGE =
  "Unable to reach the FinSight service. Check that the API is running.";

const AUTH_PATHS = ["/auth/", "/profile"];

const isAuthRoute = (url = "") =>
  AUTH_PATHS.some((path) => String(url).includes(path));

/*
 * express-validator failures arrive as { location, path, msg }.
 * They are folded into a { field: message } map that the Input and
 * Select components consume directly.
 */
const toFieldErrors = (errors) => {
  if (!Array.isArray(errors)) {
    return null;
  }

  return errors.reduce((acc, error) => {
    const field = error.path || error.field || error.param;

    if (field && !acc[field]) {
      acc[field] = error.msg || error.message || "Invalid value";
    }

    return acc;
  }, {});
};

const FALLBACK_MESSAGES = {
  400: "The information provided was not accepted.",
  401: "Your session is no longer valid. Please sign in again.",
  403: "You do not have access to this resource.",
  404: "The requested information could not be found.",
  429: "Too many requests. Please try again shortly.",
  500: "The FinSight service reported an unexpected error.",
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/*
 * Attach the bearer token expected by the protect middleware.
 */
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
 * Resolve with the backend envelope so services can read both
 * `data` and `message`, and reject with ApiError.
 */
api.interceptors.response.use(
  (response) => {
    const payload = response?.data;

    if (payload && typeof payload === "object" && "success" in payload) {
      return payload;
    }

    return { success: true, message: "", data: payload ?? null };
  },
  (error) => {
    if (error?.response) {
      const { status, data } = error.response;
      const message =
        (typeof data === "string" ? data : data?.message) ||
        FALLBACK_MESSAGES[status] ||
        "Something went wrong. Please try again.";

      const fieldErrors = toFieldErrors(data?.errors);

      /*
       * A rejected token on a protected call means the session is over.
       * Login and registration failures must not sign the user out, so
       * only protected endpoints trigger the broadcast.
       */
      if (status === 401 && !isAuthRoute(error.config?.url) && getToken()) {
        clearSession();

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent(UNAUTHORIZED_EVENT, { detail: { message } })
          );
        }
      }

      return Promise.reject(
        new ApiError(message, {
          status,
          errors: Array.isArray(data?.errors) ? data.errors : null,
          fieldErrors,
          data: data ?? null,
        })
      );
    }

    if (error?.code === "ECONNABORTED") {
      return Promise.reject(
        new ApiError("The request timed out. Please try again.", { status: 0 })
      );
    }

    return Promise.reject(
      new ApiError(NETWORK_ERROR_MESSAGE, { status: 0 })
    );
  }
);

/*
 * Services return the payload itself instead of the envelope.
 */
export const unwrap = (response) => response?.data ?? null;

export const unwrapMessage = (response, fallback = "Done") =>
  response?.message || fallback;

export const buildQuery = (params = {}) => {
  const query = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (typeof value === "string" && value.trim() === "") {
      return;
    }

    query[key] = value;
  });

  return query;
};

export default api;

/*
 * toRangeParams
 *
 * Turns the "From Date" / "To Date" inputs of the filter panels into the
 * startDate / endDate query parameters the API understands.
 *
 * The bounds are generated as instants in the browser timezone because
 * date-only values are stored that way, which keeps a filter for March 1
 * aligned with a record whose date was entered as March 1.
 */
export const toRangeParams = ({
  dateFrom,
  dateTo,
  startDate,
  endDate,
} = {}) => {
  const params = {};

  const from = dateFrom || startDate;
  const to = dateTo || endDate;

  const toInfinite = (value, suffix) => {
    const iso = String(value).slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      return null;
    }

    const parsed = new Date(`${iso}T${suffix}`);

    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  };

  if (from) {
    const value = toInfinite(from, "00:00:00.000");

    if (value) {
      params.startDate = value;
    }
  }

  if (to) {
    const value = toInfinite(to, "23:59:59.999");

    if (value) {
      params.endDate = value;
    }
  }

  return params;
};

/*
 * Turns a date-only form value into the ISO string the API's isISO8601
 * validator expects, anchored to midnight in the browser timezone.
 */
export const toApiDate = (value) => {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const iso = String(value).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }

  const local = new Date(`${iso}T00:00:00.000`);

  return Number.isNaN(local.getTime())
    ? new Date().toISOString()
    : local.toISOString();
};