/*
 * Storage
 * -------
 * Small, safe wrapper around localStorage.
 *
 * Everything the app persists goes through here so the API client,
 * AuthContext and preference screens never touch localStorage directly and
 * so a disabled/full storage never crashes the application.
 */

import { STORAGE_KEYS, DEFAULT_CURRENCY } from "../constants/app";

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readItem = (key, fallback = null) => {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (raw === null) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (error) {
    // Corrupted value or blocked storage: behave like an empty session.
    return fallback;
  }
};

const writeItem = (key, value) => {
  if (!isBrowser()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

const removeItem = (key) => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    // Ignored on purpose.
  }
};

/*
 * Session token
 */
export const getToken = () => {
  const token = readItem(STORAGE_KEYS.TOKEN);

  return typeof token === "string" && token ? token : null;
};

export const setToken = (token) => {
  if (!token) {
    removeItem(STORAGE_KEYS.TOKEN);
    return null;
  }

  writeItem(STORAGE_KEYS.TOKEN, token);

  return token;
};

export const clearToken = () => removeItem(STORAGE_KEYS.TOKEN);

/*
 * Cached user record (id, email, name, currency, preferences).
 * Only used to paint the interface instantly while the profile reloads.
 */
export const getCachedUser = () => {
  const user = readItem(STORAGE_KEYS.USER);

  return user && typeof user === "object" ? user : null;
};

export const setCachedUser = (user) => {
  if (!user) {
    removeItem(STORAGE_KEYS.USER);
    return null;
  }

  writeItem(STORAGE_KEYS.USER, user);

  return user;
};

/*
 * Preferences are also stored on the user document. The local copy keeps
 * currency and theme working before the profile request resolves.
 */
export const getPreferences = () =>
  readItem(STORAGE_KEYS.PREFERENCES, {
    currency: DEFAULT_CURRENCY,
    theme: "light",
  });

export const setPreferences = (preferences) => {
  writeItem(STORAGE_KEYS.PREFERENCES, {
    ...getPreferences(),
    ...(preferences || {}),
  });
};

/*
 * Password reset hand-off between the OTP and reset screens.
 * Cleared as soon as the password has been changed.
 */
export const getResetSession = () => readItem(STORAGE_KEYS.RESET_SESSION);

export const setResetSession = (session) => {
  if (!session) {
    removeItem(STORAGE_KEYS.RESET_SESSION);
    return null;
  }

  writeItem(STORAGE_KEYS.RESET_SESSION, session);

  return session;
};

/*
 * Ends the local session without touching the server
 * (the API is stateless and uses bearer tokens).
 */
export const clearSession = () => {
  removeItem(STORAGE_KEYS.TOKEN);
  removeItem(STORAGE_KEYS.USER);
  removeItem(STORAGE_KEYS.RESET_SESSION);
};

export const hasSession = () => Boolean(getToken());

export const storage = {
  getToken,
  setToken,
  clearToken,
  getCachedUser,
  setCachedUser,
  getPreferences,
  setPreferences,
  getResetSession,
  setResetSession,
  clearSession,
  hasSession,
};

export default storage;