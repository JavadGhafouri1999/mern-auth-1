import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import { ThemeProvider, createTheme, useColorScheme as useMaterialColorScheme } from "@mui/material/styles";
import { extendTheme as extendJoyTheme, useColorScheme, CssVarsProvider, THEME_ID } from "@mui/joy/styles";
import InitColorSchemeScript from "@mui/joy/InitColorSchemeScript";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
					<SyncThemeMode />
					<InitColorSchemeScript />
					<BrowserRouter>
						<AppRoutes />
					</BrowserRouter>
				</CssVarsProvider>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
