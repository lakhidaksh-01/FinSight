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
  const update = (event) => setValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(values);
      navigate(location.state?.from?.pathname || ROUTES.DASHBOARD, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in.");
    }
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to see your financial picture.">
    <form onSubmit={submit} className="space-y-5">
      <Input label="Email address" name="email" type="email" value={values.email} onChange={update} placeholder="you@example.com" autoComplete="email" required />
      {location.state?.notice && <p role="status" className="rounded-lg border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-2.5 text-sm text-[#b7dbbd]">{location.state.notice}</p>}
      <div><div className="mb-2 flex justify-between"><label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label><Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-[#a5d9ad] hover:text-white">Forgot password?</Link></div><Input name="password" type="password" value={values.password} onChange={update} placeholder="Enter your password" autoComplete="current-password" required /></div>
      {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm text-red-300">{error}</p>}
      <Button type="submit" loading={authenticating} fullWidth className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Sign in</Button>
    </form>
    <p className="mt-6 text-center text-sm text-[#9aa79f]">New to FinSight? <Link to={ROUTES.REGISTER} className="font-medium text-[#b7dbbd] hover:text-white">Create an account</Link></p>
  </AuthShell>;
}