import {
  ShieldCheck,
  LockKeyhole,
  LogOut,
} from "lucide-react";
import Button from "../common/Button";

/*
 * SecuritySection
 * ---------------
 * Account security and session management.
 */
function SecuritySection({ onChangePassword, onLogout, loading = false }) {
  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-7">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--info-soft)] text-[var(--info)]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-[var(--text-primary)]">Security</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Manage your account security and session.</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <LockKeyhole size={18} className="mt-0.5 text-[var(--text-muted)]" />
            <div>
              <p className="font-medium text-[var(--text-primary)]">Password</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Update your account password.</p>
            </div>
          </div>

          <Button variant="outline" size="small" onClick={onChangePassword} disabled={loading}>
            Change Password
          </Button>
        </div>

        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <LogOut size={18} className="mt-0.5 text-[var(--text-muted)]" />
            <div>
              <p className="font-medium text-[var(--text-primary)]">Sign out</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">End your current FinSight session.</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="small"
            onClick={onLogout}
            disabled={loading}
            className="text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SecuritySection;
