import { Alert, Box, Container, Divider, Stack, Typography } from "@mui/joy";
import dayjs from "dayjs";
import jalaliPlugin from "@zoomit/dayjs-jalali-plugin";
import "dayjs/locale/fa";
import useAuth from "../hooks/useAuth";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Extend dayjs with jalali plugin
dayjs.extend(jalaliPlugin);

export default function ProfilePage() {
	const { user } = useAuth();

	const formatJoinDate = (dateString: string) => {
		return dayjs(dateString).calendar("jalali").locale("fa").format("YYYY/MM/DD");
	};

	const genderTranslations: Record<string, string> = {
		male: "آقا",
		female: "خانم",
	};
	const roleTranslations: Record<string, string> = {
		user: "کاربر",
		admin: "مدیر",
		assistant: "دستیار",
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "start",
				justifyContent: "center",
				height: "100%",
				width: "100%",
				paddingX: { xs: 4, sm: 6, xl: 8 },
			}}>
			<Container
				sx={{
					width: 1,
					maxWidth: { xs: 1, sm: "sm" },
					backgroundColor: "background.surface",
					paddingBottom: 4,
					paddingTop: 1,
					paddingX: 6,
					borderRadius: 8,
				}}>
				{user ? (
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Alert
							key={user.verified ? "احراز شده" : "تایید نشده"}
							sx={{ alignItems: "flex-start", justifyContent: "start", marginBottom: 2 }}
							startDecorator={user.verified ? <CheckCircleIcon /> : <WarningIcon />}
							variant="soft"
							color={user.verified ? "success" : "warning"}>
							<div>
								<div>{user.verified ? "احراز شده" : "تایید نشده"}</div>
								<Typography level="body-sm" color={user.verified ? "success" : "warning"}>
									{user.verified
										? "حساب کاربری شما تایید شده است"
										: "حساب کاربری شما تایید نشده است"}
								</Typography>
							</div>
						</Alert>
						<>
							<Typography level="title-md" sx={{ marginBottom: 2, color: "text.secondary" }}>
								اطلاعات کاربری
							</Typography>
							<Stack spacing={2}>
								<div className="flex items-center gap-2">
									<span className="text-sm">نام کاربری:</span>
									<span className="">{user.username}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">آدرس ایمیل:</span>
									<Typography level="body-md" sx={{ color: "text.secondary" }}>
										{user.email}
									</Typography>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">نقش کاربری:</span>
									<span>{roleTranslations[user.role]}</span>
								</div>
							</Stack>
							<Divider sx={{ marginY: 2, color: "text.secondary" }} />
							<Typography level="title-md" sx={{ marginBottom: 2, color: "text.secondary" }}>
								اطلاعات شخصی
							</Typography>
							<Stack
								direction="row"
								sx={{
									gap: 4,
									justifyContent: "flex-start",
									alignItems: "center",
								}}>
								<div className="flex items-center gap-2">
									<span className="text-sm">جنسیت:</span>
									<span>{genderTranslations[user.sex]}</span>
								</div>

								<div className="flex items-center gap-2">
									<span className="text-sm">تاریخ تولد:</span>
									<span>{user.birth}</span>
								</div>
							</Stack>
							<Divider sx={{ marginY: 2 }} />
							<Typography level="title-md" sx={{ marginBottom: 2, color: "text.secondary" }}>
								جزئیات حساب
							</Typography>
							<Stack spacing={2}>
								<div className="flex items-center gap-2">
									<div className="text-sm">شناسه کاربری:</div>
									<Typography level="body-md" sx={{ color: "text.secondary" }}>
										{user._id}
									</Typography>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">تاریخ عضویت:</span>
									<span>{formatJoinDate(user.createdAt)}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">تاریخ بروزرسانی:</span>
									<span className="">{formatJoinDate(user.updatedAt)}</span>
								</div>
							</Stack>
						</>
					</Box>
				) : (
					<Alert
						sx={{ alignItems: "flex-start", justifyContent: "start", marginBottom: 2 }}
						startDecorator={<InfoIcon />}
						variant="soft"
						color="neutral">
						<div>
							<div>اطلاعاتی دریافت نشده</div>
							<Typography level="body-sm" color="neutral">
								اطلاعات حساب کاربری دریافت نشده
							</Typography>
						</div>
					</Alert>
				)}
			</Container>
		</Box>
	);
}
