import { useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/layout/PageHeader";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import PreferencesForm from "../../components/profile/PreferencesForm";
import ProfileForm from "../../components/profile/ProfileForm";
import { useProfile } from "../../hooks/useProfile";
import { ROUTES } from "../../constants/app";

export default function Profile() {
  const { profile, saving, error, save, refresh } = useProfile();
  const [notice, setNotice] = useState("");

  const saveProfile = async (values) => {
    setNotice("");
    try {
      await save({ name: values.name });
      toast.success("Profile updated");
    } catch (saveError) {
      setNotice(saveError.message || "Could not save your profile.");
    }
  };

  const savePreferences = async ({ currency, theme }) => {
    setNotice("");
    try {
      await save({
        currency,
        preferences: { ...(profile?.preferences || {}), theme },
      });
      toast.success("Preferences saved");
    } catch (saveError) {
      setNotice(saveError.message || "Could not save your preferences.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Profile" }]} />
      <PageHeader
        title="Profile & settings"
        eyebrow="Account"
        description="Update your account details and choose how FinSight displays your money."
      />
      {error && <ErrorState message={error} onRetry={refresh} />}
      {notice && (
        <p role="alert" className="rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          {notice}
        </p>
      )}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <ProfileForm profile={profile || {}} loading={saving} onSubmit={saveProfile} />
          <PreferencesForm
            preferences={{
              ...(profile?.preferences || {}),
              currency: profile?.currency || profile?.preferences?.currency,
            }}
            loading={saving}
            onSubmit={savePreferences}
          />
        </div>

        <aside className="h-fit rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <UserRound size={18} />
          </div>
          <h2 className="mt-4 text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            Account security
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Password changes use a one-time email code. Your account session is
            cleared locally when you sign out.
          </p>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
          >
            <LockKeyhole size={15} /> Reset password
          </Link>
          <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
            <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
            <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">
              {profile?.email || ""}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
