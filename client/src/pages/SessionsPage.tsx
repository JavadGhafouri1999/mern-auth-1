import { Box, CircularProgress, Container, Stack } from "@mui/joy";
import useSession from "../hooks/useSessions";
import SessionCard from "../components/SessionCard";

export default function Page() {
	const { sessions, isPending, isSuccess, isError } = useSession();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "start",
				justifyContent: "center",
				height: "100%",
				width: "100%",
				paddingX: { xs: 2, sm: 4, xl: 6 },
			}}>
			<Container
				className="custom-scrollbar"
				sx={{
					width: 1,
					maxWidth: { xs: 1, sm: "sm" },
					backgroundColor: "background.surface",
					height: "80vh",
					overflowY: "auto",
					paddingY: 4,
					paddingX: 1,
					borderRadius: 8,
				}}>
				{isPending && (
					<div className="flex items-center justify-center">
						<CircularProgress size="lg" />
					</div>
				)}
				{isError && (
					<div className="flex items-center justify-center text-center">
						<p className="md:text-xl">مشکلی در دریافت اطلاعات نشست ها بوجود آمد</p>
					</div>
				)}
				{isSuccess && (
					<Stack spacing={3}>
						{sessions.map((session) => (
							<SessionCard key={session._id} {...session} />
						))}
					</Stack>
				)}
			</Container>
		</Box>
	);
}
