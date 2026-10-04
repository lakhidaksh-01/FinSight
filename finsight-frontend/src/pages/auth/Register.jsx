import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ROUTES } from "../../constants/app";
import { useAuth } from "../../hooks/useAuth";
import AuthShell from "./AuthShell";

export default function Register() {
  const { register, authenticating } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const update = (event) => setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (values.password.length < 8) return setError("Use at least 8 characters for your password.");
    if (values.password !== values.confirmPassword) return setError("Your passwords do not match.");
    try {
      await register(values);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (registerError) {
      setError(registerError.message || "Unable to create your account.");
    }
  };

  return <AuthShell title="Create your account" subtitle="A clearer view of your money starts here.">
    <form onSubmit={submit} className="space-y-4">
      <Input label="Full name" name="name" value={values.name} onChange={update} placeholder="Your name" autoComplete="name" maxLength={100} required />
      <Input label="Email address" name="email" type="email" value={values.email} onChange={update} placeholder="you@example.com" autoComplete="email" required />
      <Input label="Password" name="password" type="password" value={values.password} onChange={update} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
      <Input label="Confirm password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={update} placeholder="Enter it again" autoComplete="new-password" required />
      {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm text-red-300">{error}</p>}
      <Button type="submit" loading={authenticating} fullWidth className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Create account</Button>
    </form>
    <p className="mt-6 text-center text-sm text-[#9aa79f]">Already have an account? <Link to={ROUTES.LOGIN} className="font-medium text-[#b7dbbd] hover:text-white">Sign in</Link></p>
  </AuthShell>;
}