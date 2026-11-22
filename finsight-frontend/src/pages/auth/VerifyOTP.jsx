import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ROUTES } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";
import AuthShell from "./AuthShell";

export default function VerifyOTP() {
  const { verifyOtp, forgotPassword, authenticating, resetSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || resetSession?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await verifyOtp({ email, otp });
      navigate(ROUTES.RESET_PASSWORD, {
        state: { email, resetToken: result.resetToken },
        replace: true,
      });
    } catch (verifyError) {
      setError(verifyError.message || "That code could not be verified.");
    }
  };

  const resend = async () => {
    setError("");
    try {
      await forgotPassword(email);
      setSeconds(90);
      setOtp("");
    } catch (resendError) {
      setError(resendError.message || "Unable to send another code.");
    }
  };

  if (!email) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="Start with your account email to request a reset code."
      >
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Request a code
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Enter your code"
      subtitle={`Enter the 6-digit code sent to ${email}. Codes expire after 90 seconds.`}
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="One-time code"
          name="otp"
          value={otp}
          onChange={(event) =>
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="000000"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
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
          Verify code
        </Button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-[var(--text-muted)]">
          {seconds ? `Code expires in ${seconds}s` : "Code expired"}
        </span>
        <button
          type="button"
          disabled={seconds > 0 || authenticating}
          onClick={resend}
          className="font-medium text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:text-[var(--text-primary)]"
        >
          Resend code
        </button>
      </div>
      <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Use a different email
        </Link>
      </p>
    </AuthShell>
  );
}
