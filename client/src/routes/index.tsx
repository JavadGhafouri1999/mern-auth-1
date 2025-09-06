import { lazy, Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";
import { Route, Routes } from "react-router";
import AuthLayout from "../pages/layouts/AuthLayout";
import MainLayout from "../pages/layouts/MainLayout";
import DashboardLayout from "../pages/layouts/DashboardLayout";

// Auth Routes
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
// Main Routes
const HomePage = lazy(() => import("../pages/HomePage"));

export default function AppRoutes() {
	return (
		<Suspense fallback={<LoadingPage />}>
			<Routes>
				{/* Layout - Auth */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />}></Route>
					<Route path="/signup" element={<SignupPage />}></Route>
				</Route>
				{/* Layout - Main */}
				<Route element={<MainLayout />}>
					<Route path="/" element={<HomePage />}></Route>
					<Route path="/all-posts"></Route>
				</Route>
				{/* Layout - Dashboard */}
				<Route element={<DashboardLayout />}>
					<Route path="/profile"></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}
