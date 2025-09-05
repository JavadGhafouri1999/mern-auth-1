import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<div className="flex items-center justify-center h-screen w-full bg-gradient-to-bl from-gray-900 to-gray-950">
			<Outlet />
		</div>
	);
}
