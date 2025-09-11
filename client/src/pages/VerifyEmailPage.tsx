import { Alert, AspectRatio, Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { verifyEmail } from "../lib/api";

import BeenhereTwoToneIcon from "@mui/icons-material/BeenhereTwoTone";
import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
export default function VerifyEmailPage() {
	const { code } = useParams();

	const { isPending, isSuccess, isError } = useQuery({
		queryKey: ["vemailVerification", code],
		queryFn: () => verifyEmail(code!),
	});
	return (
		<Box sx={{ height: "100%", width: "100%", paddingX: { xs: 4, sm: 6, xl: 8 } }}>
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					marginX: "auto",
					maxWidth: "md",
					paddingY: 12,
					paddingX: 6,
					textAlign: "center",
				}}>
				{isPending ? (
					<CircularProgress />
				) : (
					<Stack spacing={6}>
						<Alert
							size="lg"
							color={isSuccess ? "success" : "warning"}
							variant="soft"
							invertedColors
							startDecorator={
								<AspectRatio
									variant="solid"
									ratio="1"
									sx={{
										minWidth: 40,
										borderRadius: "50%",
										boxShadow: "0 2px 12px 0 rgb(0 0 0/0.2)",
									}}>
									<div>
										{isSuccess ? (
											<BeenhereTwoToneIcon className="text-xl" />
										) : (
											<ErrorTwoToneIcon className="text-xl" />
										)}
									</div>
								</AspectRatio>
							}
							sx={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								overflow: "hidden",
								maxWidth: "md",
								marginX: "auto",
							}}>
							<div className="flex flex-col gap-2 items-center">
								<Typography level="title-lg">
									{isSuccess ? "تایید شده" : "تایید نشده"}
								</Typography>
								<Typography level="body-sm">
									{isSuccess ? "حساب شما با موفقیت تایید شده" : "حساب شما تایید نشده است"}
								</Typography>
							</div>
						</Alert>
					</Stack>
				)}
				{isError && (
					<div className="flex flex-col items-center justify-center gap-4 mt-4">
						<p>لینک شما نامعتبر یا منقضی شده است</p>
						<Button
							variant="soft"
							sx={{
								backgroundColor: "background.surface",
							}}
							className="transition-all duration-300">
							<Link to="/password/forgot" className="text-sm">
								دریافت لینک جدید
							</Link>
						</Button>
					</div>
				)}
				<Button
					variant="outlined"
					sx={{ backgroundColor: "background.surface", marginTop: 2 }}
					className="transition-all duration-300">
					<Link to="/" className="text-sm">
						بازگشت به صفحه اصلی
					</Link>
				</Button>
			</Container>
		</Box>
	);
}
