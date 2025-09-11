// AuthRedirectListener.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { navEvents } from "./navigation";

export default function AuthRedirectListener() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const handler = () => {
			navigate("/login", { state: { redirect: location.pathname } });
		};
		navEvents.on("authError", handler);
		return () => navEvents.off("authError", handler);
	}, [navigate, location]);

	return null;
}
