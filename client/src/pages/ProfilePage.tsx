import { Box, CircularProgress, Container, Divider, Grid, Stack, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api";
import dayjs from "dayjs";
import jalaliPlugin from "@zoomit/dayjs-jalali-plugin";
import "dayjs/locale/fa";

// Extend dayjs with jalali plugin
dayjs.extend(jalaliPlugin);

export default function ProfilePage() {
	const { data, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: getUser,
	});

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					width: "100%",
					paddingX: { xs: 4, sm: 6, xl: 8 },
				}}>
				<CircularProgress size="lg" />
			</Box>
		);
	}

	const formatJoinDate = (dateString: string) => {
		return dayjs(dateString).calendar("jalali").locale("fa").format("YYYY/MM/DD");
	};

	return (
		<Box sx={{ height: "100%", width: "100%", paddingX: { xs: 4, sm: 6, xl: 8 } }}>
			<Container
				sx={{
					width: 1,
					maxWidth: { xs: 1, sm: "sm" },
					backgroundColor: "background.surface",
					paddingY: 4,
					paddingX: 6,
					borderRadius: 8,
				}}>
				{data ? (
					<>
						<Stack spacing={2}>
							<div className="flex items-center gap-2">
								<span className="text-sm">نام کاربری:</span>
								<span className="">{data.username}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm">آدرس ایمیل:</span>
								<Typography level="body-md" sx={{ color: "text.secondary" }}>
									{data.email}
								</Typography>
							</div>
						</Stack>
						<Divider sx={{ marginY: 2 }} />
						<h3 className="font-bold mb-4">اطلاعات شخصی</h3>
						<Grid container spacing={2} columns={2} sx={{ flexGrow: 1 }}>
							<Grid>
								<div className="flex items-center gap-2">
									<span className="text-sm"> جنسیت:</span>
									<span>{data.sex}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">تاریخ تولد:</span>
									<span>{data.birth}</span>
								</div>
							</Grid>
							<Grid>
								<div className="flex items-center gap-2">
									<span className="text-sm"> نقش کاربری:</span>
									<span>{data.role}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm">وضعیت احراز:</span>
									<span>{data.verified}</span>
								</div>
							</Grid>
						</Grid>
						<Divider sx={{ marginY: 2 }} />
						<Stack spacing={2}>
							<div className="flex items-center gap-2">
								<div className="text-sm">شناسه کاربری:</div>
								<Typography level="body-md" sx={{ color: "text.secondary" }}>
									{data._id}
								</Typography>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm">تاریخ عضویت:</span>
								<span>{formatJoinDate(data.createdAt)}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm">تاریخ بروزرسانی:</span>
								<span className="">{formatJoinDate(data.updatedAt)}</span>
							</div>
						</Stack>
					</>
				) : (
					<p className="text-center text-lg">هیچ اطلاعاتی از کاربر در دسترس نیست</p>
				)}
			</Container>
		</Box>
	);
}
