import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router";

const theme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</ThemeProvider>
	);
}
