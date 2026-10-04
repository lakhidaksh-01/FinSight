/*
 * profileService
 * --------------
 * Talks to /api/profile.
 *
 *   GET /api/profile  -> the signed-in user without the password
 *   PUT /api/profile  -> updates name, currency and preferences only
 *
 * The backend whitelists those three fields
 * (backend-v1/services/authService.js -> updateProfile), so the email address
 * shown on the profile page is read-only and is never sent in the request.
 * The API has no change-password endpoint; password changes go through the
 * forgot-password / verify-OTP / reset flow in authService.
 */

import api, { unwrap, unwrapMessage } from "./api";

const RESOURCE = "/profile";

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  return {
    ...record,
    id: record._id || record.id,
    name: record.name || "",
    email: record.email || "",
    currency: record.currency || "INR",
    preferences: record.preferences || {},
  };
};

export const profileService = {
  async getProfile() {
    const response = await api.get(RESOURCE);

    return fromApiRecord(unwrap(response));
  },

  /*
   * Only the whitelisted fields are forwarded; anything else the profile page
   * carries locally (email, id, createdAt) is stripped before the request.
   */
  async updateProfile({ name, currency, preferences } = {}) {
    const payload = {};

    if (name !== undefined) {
      payload.name = String(name).trim().slice(0, 100);
    }

    if (currency) {
      payload.currency = String(currency).trim();
    }

    if (preferences && typeof preferences === "object") {
      payload.preferences = preferences;
    }

    const response = await api.put(RESOURCE, payload);

    return {
      profile: fromApiRecord(unwrap(response)),
      message: unwrapMessage(response, "Profile updated successfully"),
    };
  },

  async updatePreferences(preferences = {}) {
    return profileService.updateProfile({ preferences });
  },
};

export default profileService;