import { lazy, Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";
import { Route, Routes } from "react-router";
import AuthLayout from "../pages/layouts/AuthLayout";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));

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
				<Route>
					<Route path="/"></Route>
					<Route path="/profile"></Route>
				</Route>
			</Routes>
		</Suspense>
	);
}
