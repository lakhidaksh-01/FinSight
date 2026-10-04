import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ROUTES } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";
import AuthShell from "./AuthShell";

export default function ForgotPassword() {
  const { forgotPassword, authenticating } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await forgotPassword(email);
      setMessage(result.message);
      navigate(ROUTES.VERIFY_OTP, { state: { email: email.trim().toLowerCase(), message: result.message } });
    } catch (requestError) {
      setError(requestError.message || "Unable to request a reset code.");
    }
  };

  return <AuthShell title="Reset your password" subtitle="We’ll send a one-time code to the email on your account.">
    <form onSubmit={submit} className="space-y-5">
      <Input label="Email address" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required />
      {message && <p role="status" className="text-sm text-[#b7dbbd]">{message}</p>}
      {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm text-red-300">{error}</p>}
      <Button type="submit" loading={authenticating} fullWidth className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Send reset code</Button>
    </form>
    <p className="mt-6 text-center text-sm text-[#9aa79f]">Remember your password? <Link to={ROUTES.LOGIN} className="font-medium text-[#b7dbbd] hover:text-white">Sign in</Link></p>
  </AuthShell>;
}