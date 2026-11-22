import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ROUTES } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";
import AuthShell from "./AuthShell";

export default function Login() {
  const { login, authenticating } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const update = (event) =>
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(values);
      navigate(location.state?.from?.pathname || ROUTES.DASHBOARD, {
        replace: true,
      });
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in.");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see your financial picture."
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={update}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        {location.state?.notice && (
          <p role="status" className="rounded-lg border border-[var(--success)]/20 bg-[var(--success-soft)] px-3 py-2.5 text-sm text-[var(--success)]">
            {location.state.notice}
          </p>
        )}
        <div>
          <div className="mb-2 flex justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            name="password"
            type="password"
            value={values.password}
            onChange={update}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>
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
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        New to FinSight?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
