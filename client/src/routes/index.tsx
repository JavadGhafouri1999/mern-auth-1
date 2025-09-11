import { lazy, Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";
import { Route, Routes } from "react-router";
import AuthLayout from "../pages/layouts/AuthLayout";
import MainLayout from "../pages/layouts/MainLayout";

// Auth Routes
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const ForgetPasswordPage = lazy(() => import("../pages/ForgetPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
// Main Routes
const HomePage = lazy(() => import("../pages/HomePage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SessionsPage = lazy(() => import("../pages/SessionsPage"));

export default function AppRoutes() {
	return (
		<Suspense fallback={<LoadingPage />}>
			<Routes>
				{/* Layout - Auth */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/signup" element={<SignupPage />}></Route>
					<Route path="/password/forgot" element={<ForgetPasswordPage />}></Route>
					<Route path="/password/reset" element={<ResetPasswordPage />}></Route>
					<Route path="/email/verify/:code" element={<VerifyEmailPage />}></Route>
				</Route>
				{/* Layout - Main */}
				<Route element={<MainLayout />}>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/profile" element={<ProfilePage />}></Route>
					<Route path="/sessions" element={<SessionsPage />}></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}
