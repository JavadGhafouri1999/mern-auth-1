import { Avatar, Box, ListDivider, Stack, Typography } from "@mui/joy";
import ThemeToggle from "../ThemeToggle";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import { Link, useNavigate } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
	const navigate = useNavigate();

	function handleLogout() {
		navigate("/login");
	}

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				backgroundColor: "background.surface",
				color: "text.primary",
				height: "62px",
				width: "100%",
				paddingX: { xs: 4, sm: 6, xl: 8 },
			}}>
			<Stack direction="row">
				<Link to="/">
					<Typography level="h3">LOGO</Typography>
				</Link>
			</Stack>
			<Stack direction="row">
				<ThemeToggle />
				<Dropdown>
					<MenuButton
						sx={{
							border: "none",
							padding: 0,
							margin: 0,
							borderRadius: "50%",
							backgroundColor: "transparent",
							"&:hover": {
								backgroundColor: "transparent",
							},
						}}>
						<Avatar variant="soft" alt="Remy Sharp" src="/broken-image.jpg">
							BT
						</Avatar>
					</MenuButton>
					<Menu size="sm" sx={{ paddingTop: 0 }}>
						<MenuItem sx={{ paddingLeft: 8 }}>
							<PersonIcon />
							<Link to="profile">پروفایل</Link>
						</MenuItem>
						<MenuItem disabled>
							<SettingsIcon />
							<Link to="profile">تنظیمات</Link>
						</MenuItem>
						<ListDivider />
						<MenuItem onClick={handleLogout} color="danger">
							<LogoutIcon />
							<span>خروج</span>
						</MenuItem>
					</Menu>
				</Dropdown>
			</Stack>
		</Box>
	);
}
