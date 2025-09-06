import { useState } from "react";
import { useColorScheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Button } from "@mui/joy";
import Zoom from "@mui/material/Zoom";

export default function ThemeToggle() {
	const [show, setShow] = useState(true);

	const { mode, setMode } = useColorScheme();
	if (!mode) {
		return null;
	}

	const handleToggle = () => {
		setShow(false);
		setTimeout(() => {
			setMode(mode === "light" ? "dark" : "light");
			setShow(true);
		}, 100);
	};

	return (
		<Button
			className="max-w-fit rounded-full hover:bg-transparent "
			variant="plain"
			onClick={handleToggle}>
			<Zoom in={show} timeout={150} key={mode}>
				<span>
					{mode === "dark" ? (
						<DarkModeIcon  />
					) : (
						<LightModeIcon sx={{ color: "orange" }} />
					)}
				</span>
			</Zoom>
		</Button>
	);
}
