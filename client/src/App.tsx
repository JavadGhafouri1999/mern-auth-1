import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import { ThemeProvider, createTheme, useColorScheme as useMaterialColorScheme } from "@mui/material/styles";
import { extendTheme as extendJoyTheme, useColorScheme, CssVarsProvider, THEME_ID } from "@mui/joy/styles";

const theme = createTheme({ colorSchemes: { light: true, dark: true } });
const joyTheme = extendJoyTheme({
	colorSchemes: {
		light: {
			palette: {
				background: {
					body: "#FAF7F0", // page
					surface: "#E4E0E1", // card
				},
			},
		},
		dark: {
			palette: {
				background: {
					body: "#1A1A1D",
					surface: "#222831",
				},
			},
		},
	},
});
function SyncThemeMode() {
	const { setMode } = useColorScheme();
	const { mode } = useMaterialColorScheme();
	useEffect(() => {
		if (mode) {
			setMode(mode);
		}
	}, [mode, setMode]);
	return null;
}

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
				<SyncThemeMode />
				<BrowserRouter>
					<AppRoutes />
				</BrowserRouter>
			</CssVarsProvider>
		</ThemeProvider>
	);
}
