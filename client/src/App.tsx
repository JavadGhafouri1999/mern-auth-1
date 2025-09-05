import AppRoutes from "./routes";
import { BrowserRouter } from "react-router";
import { createTheme, ThemeProvider, THEME_ID as MATERIAL_THEME_ID } from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const materialTheme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

export default function App() {
	return (
		<ThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
			<JoyCssVarsProvider>
				<CssBaseline enableColorScheme />
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</JoyCssVarsProvider>
		</ThemeProvider>
	);
}
