import { lazy, Suspense, useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import { ROUTES } from "../constants/app";
import { useAuth } from "../hooks/useAuth";

const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const VerifyOTP = lazy(() => import("../pages/auth/VerifyOTP"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("../pages/app/Dashboard"));
const Expenses = lazy(() => import("../pages/app/Expenses"));
const Income = lazy(() => import("../pages/app/Income"));
const Budgets = lazy(() => import("../pages/app/Budgets"));
const Goals = lazy(() => import("../pages/app/Goals"));
const Analytics = lazy(() => import("../pages/app/Analytics"));
const Predictions = lazy(() => import("../pages/app/Predictions"));
const Profile = lazy(() => import("../pages/app/Profile"));

function GuestRoute() {
	const { user, loading } = useAuth();

	if (loading) return <div className="flex min-h-screen items-center justify-center"><LoadingSpinner size="large" text="Loading FinSight…" /></div>;
	if (user) return <Navigate to={ROUTES.DASHBOARD} replace />;

	return <Outlet />;
}

export default function AppRoutes() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [pathname]);

	return <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><LoadingSpinner size="large" text="Loading FinSight…" /></div>}><Routes>
		<Route path={ROUTES.LANDING} element={<Landing />} />
		<Route element={<GuestRoute />}>
    <Route path={ROUTES.LOGIN} element={<Login />} />
    <Route path={ROUTES.REGISTER} element={<Register />} />
</Route>

<Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
<Route path={ROUTES.VERIFY_OTP} element={<VerifyOTP />} />
<Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
		<Route element={<ProtectedRoute />}>
			<Route path={ROUTES.APP} element={<AppLayout />}>
				<Route index element={<Navigate to="dashboard" replace />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="expenses" element={<Expenses />} />
				<Route path="income" element={<Income />} />
				<Route path="budgets" element={<Budgets />} />
				<Route path="goals" element={<Goals />} />
				<Route path="analytics" element={<Analytics />} />
				<Route path="predictions" element={<Predictions />} />
				<Route path="profile" element={<Profile />} />
			</Route>
		</Route>
		<Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
	</Routes></Suspense>;
}
