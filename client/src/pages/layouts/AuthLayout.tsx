import { Box } from "@mui/joy";
import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				width: "100%",
				backgroundColor: "background.body",
				color: "text.primary",
			}}>
			<Outlet />
		</Box>
	);
}
