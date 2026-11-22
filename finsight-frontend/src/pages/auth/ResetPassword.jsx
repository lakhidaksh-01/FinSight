import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ROUTES } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";
import AuthShell from "./AuthShell";

export default function ResetPassword() {
  const { resetPassword, authenticating, resetSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || resetSession?.email || "";
  const resetToken = location.state?.resetToken || resetSession?.resetToken || "";
  const [values, setValues] = useState({ password: "", confirmation: "" });
  const [error, setError] = useState("");
  const update = (event) =>
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (values.password.length < 8) {
      return setError("Use at least 8 characters for your new password.");
    }
    if (values.password !== values.confirmation) {
      return setError("Your passwords do not match.");
    }
    try {
      await resetPassword({ email, resetToken, newPassword: values.password });
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { notice: "Password reset successfully. Sign in with your new password." },
      });
    } catch (resetError) {
      setError(resetError.message || "Unable to reset your password.");
    }
  };

  if (!email || !resetToken) {
    return (
      <AuthShell
        title="Reset session expired"
        subtitle="Request a new one-time code to continue."
      >
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Request a new code
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle={`Set a new password for ${email}.`}
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="New password"
          name="password"
          type="password"
          value={values.password}
          onChange={update}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          label="Confirm new password"
          name="confirmation"
          type="password"
          value={values.confirmation}
          onChange={update}
          placeholder="Enter it again"
          autoComplete="new-password"
          required
        />
        {error && (
          <p role="alert" className="rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-3 py-2.5 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
        <Button
          type="submit"
          loading={authenticating}
          fullWidth
          className="bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
        >
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
