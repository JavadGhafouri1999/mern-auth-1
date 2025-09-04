import { Suspense } from "react";
import LoadingPage from "../pages/LoadingPage";
import { Route, Routes } from "react-router";
import AuthLayout from "../pages/layouts/AuthLayout";

export default function AppRoutes() {
	return (
		<Suspense fallback={<LoadingPage />}>
			<Routes>
				{/* Layout - Auth */}
				<Route element={<AuthLayout />}>
					<Route path="/login"></Route>
					<Route path="/signup"></Route>
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
