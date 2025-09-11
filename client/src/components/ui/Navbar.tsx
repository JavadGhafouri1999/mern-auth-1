import { Avatar, Box, CircularProgress, ListDivider, Stack, Typography } from "@mui/joy";
import ThemeToggle from "../ThemeToggle";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import { Link, useNavigate } from "react-router";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "../../lib/api";
import queryClient from "../../lib/queryClient";

type UserData = {
	_id: string;
	email: string;
	username: string;
	sex: string;
	birth: string;
	role: string;
	profileImage: string;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
};

type NavbarProps = {
	user: UserData | undefined;
	isLoading: boolean;
};

export default function Navbar({ user, isLoading }: NavbarProps) {
	const navigate = useNavigate();

	const { mutate: signOut } = useMutation({
		mutationFn: logout,
		onSettled: () => {
			queryClient.clear();
			navigate("/login", { replace: true });
		},
	});

	function handleLogout() {
		signOut();
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
			{isLoading ? (
				<CircularProgress size="md" />
			) : (
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
							<Avatar variant="soft" alt={user?.username} src={user?.profileImage}>
								{user?.username?.slice(0, 2).toUpperCase()}
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
			)}
		</Box>
	);
}
