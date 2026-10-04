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
  const update = (event) => setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (values.password.length < 8) return setError("Use at least 8 characters for your new password.");
    if (values.password !== values.confirmation) return setError("Your passwords do not match.");
    try {
      await resetPassword({ email, resetToken, newPassword: values.password });
      navigate(ROUTES.LOGIN, { replace: true, state: { notice: "Password reset successfully. Sign in with your new password." } });
    } catch (resetError) {
      setError(resetError.message || "Unable to reset your password.");
    }
  };

  if (!email || !resetToken) return <AuthShell title="Reset session expired" subtitle="Request a new one-time code to continue."><Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-[#b7dbbd]">Request a new code</Link></AuthShell>;

  return <AuthShell title="Choose a new password" subtitle={`Set a new password for ${email}.`}>
    <form onSubmit={submit} className="space-y-5">
      <Input label="New password" name="password" type="password" value={values.password} onChange={update} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
      <Input label="Confirm new password" name="confirmation" type="password" value={values.confirmation} onChange={update} placeholder="Enter it again" autoComplete="new-password" required />
      {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm text-red-300">{error}</p>}
      <Button type="submit" loading={authenticating} fullWidth className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Update password</Button>
    </form>
  </AuthShell>;
}