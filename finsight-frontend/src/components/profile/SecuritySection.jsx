import {
  ShieldCheck,
  LockKeyhole,
  LogOut,
} from "lucide-react";
import Button from "../common/Button";

function SecuritySection({
  onChangePassword,
  onLogout,
  loading = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Security
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Manage your account security and session.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <LockKeyhole
              size={18}
              className="mt-0.5 text-slate-500"
            />

            <div>
              <p className="font-medium text-slate-900">
                Password
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Update your account password.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="small"
            onClick={onChangePassword}
            disabled={loading}
          >
            Change Password
          </Button>
        </div>

        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <LogOut
              size={18}
              className="mt-0.5 text-slate-500"
            />

            <div>
              <p className="font-medium text-slate-900">
                Sign out
              </p>

              <p className="mt-1 text-sm text-slate-500">
                End your current FinSight session.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="small"
            onClick={onLogout}
            disabled={loading}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SecuritySection;
