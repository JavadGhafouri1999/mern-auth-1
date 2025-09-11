import { Navigate, Outlet } from "react-router";
import Navbar from "../../components/ui/Navbar";
import { Box } from "@mui/joy";
import useAuth from "../../hooks/useAuth";

export default function MainLayout() {
	const { user, isLoading } = useAuth();
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				gap: 4,
				width: "100%",
				backgroundColor: "background.body",
				color: "text.primary",
			}}>
			<Navbar user={user} isLoading={isLoading} />
			{user ? (
				<Box sx={{ marginY: 4 }}>
					<Outlet />
				</Box>
			) : (
				<Navigate to="/login" replace state={{ redirect: window.location.pathname }} />
			)}
		</Box>
	);
}
