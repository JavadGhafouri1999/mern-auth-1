import { Outlet } from "react-router";
import Navbar from "../../components/ui/Navbar";
import { Box } from "@mui/joy";

export default function MainLayout() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 4,
				height: "100vh",
				width: "100%",
				backgroundColor: "background.body",
				color: "text.primary",
			}}>
			<Navbar />
			<Outlet />
		</Box>
	);
}
