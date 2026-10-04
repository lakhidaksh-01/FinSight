import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { profileService } from "../services/profileService";

export function useProfile() {
  const { user, updateUser, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = useCallback(async ({ name, currency, preferences } = {}) => {
    setSaving(true);
    setError(null);

    try {
      const result = await profileService.updateProfile({ name, currency, preferences });
      updateUser(result.profile);

      return result.profile;
    } catch (saveError) {
      setError(saveError?.message || "Unable to update your profile.");
      throw saveError;
    } finally {
      setSaving(false);
    }
  }, [updateUser]);

  return {
    profile: user,
    saving,
    error,
    save,
    refresh: refreshProfile,
    clearError: () => setError(null),
  };
}

export default useProfile;