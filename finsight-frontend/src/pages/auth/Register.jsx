import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ROUTES } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";
import AuthShell from "./AuthShell";

export default function Register() {
  const { register, authenticating } = useAuth();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const update = (event) =>
    setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (values.password.length < 8) {
      return setError("Use at least 8 characters for your password.");
    }
    if (values.password !== values.confirmPassword) {
      return setError("Your passwords do not match.");
    }
    try {
      await register(values);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (registerError) {
      setError(registerError.message || "Unable to create your account.");
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="A clearer view of your money starts here."
    >
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Full name"
          name="name"
          value={values.name}
          onChange={update}
          placeholder="Your name"
          autoComplete="name"
          maxLength={100}
          required
        />
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
        <Input
          label="Password"
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
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
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
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
