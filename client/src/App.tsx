import { useEffect } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import { ThemeProvider, createTheme, useColorScheme as useMaterialColorScheme } from "@mui/material/styles";
import { extendTheme as extendJoyTheme, useColorScheme, CssVarsProvider, THEME_ID } from "@mui/joy/styles";
import InitColorSchemeScript from "@mui/joy/InitColorSchemeScript";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const theme = createTheme({ colorSchemes: { light: true, dark: true } });
const joyTheme = extendJoyTheme({
	colorSchemes: {
		light: {
			palette: {
				background: {
					body: "#F0F5F9",
					surface: "rgba(201, 214, 223,0.3)",
					tooltip: "#D6E6F2",
				},
				text: {
					primary: "#212121",
					secondary: "#0D7377",
					tertiary: "#769FCD",
				},
				divider: "rgba(33, 33, 33,0.2)",
			},
		},
		dark: {
			palette: {
				background: {
					body: "#000000",
					surface: "rgba(255,255,255,0.07)",
					tooltip: "#2B2E4A",
				},
				text: {
					primary: "#F0F5F9",
					secondary: "#A4BE7B",
					tertiary: "#5F8D4E",
				},
				divider: "rgba(255, 255, 255,0.1)",
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
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
					<SyncThemeMode />
					<InitColorSchemeScript />
					<BrowserRouter>
						<AppRoutes />
						<Toaster position="top-center" toastOptions={{ duration: 3000 }} />
					</BrowserRouter>
				</CssVarsProvider>
			</ThemeProvider>
			<ReactQueryDevtools position="bottom" initialIsOpen={false} />
		</QueryClientProvider>
	);
}
