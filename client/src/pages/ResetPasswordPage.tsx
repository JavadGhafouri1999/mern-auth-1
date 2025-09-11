import { Box, Button, Container, FormControl, FormLabel, Input } from "@mui/joy";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router";

type FormInputType = {
	code: string;
	password: string;
};

export default function ResetPasswordPage() {
	const [showPass, setShowPass] = useState(false);
	const { register, handleSubmit, watch } = useForm<FormInputType>();
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code") || "";
	const exp = Number(searchParams.get("exp"));
	const now = Date.now();
	const validLink = code && exp && exp > now;
	const navigate = useNavigate();

	const { mutate: resetUserPassword, isPending } = useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			toast.success("رمزعبور شما با موفقیت تغییر کرد");
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error?.message);
		},
	});

	const watchPassword = watch("password", "");

	const onSubmit: SubmitHandler<FormInputType> = ({ password }) => resetUserPassword({ code, password });

	return (
		<Container
			sx={{
				maxWidth: { xs: 1, sm: "85%", md: 1 / 2, xl: 1 / 3 },
				width: 1,
				borderRadius: "lg",
				paddingY: { xs: 2, md: 3 },
				backgroundColor: "background.surface",
				marginX: 2,

				boxShadow: "md",
			}}>
			{validLink ? (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: 1,
						marginX: "auto",
						textAlign: "center",
						justifyContent: "center",
						gap: 2,
						padding: 2,
					}}>
					<h1 className="text-2xl font-semibold">بازنشانی رمزعبور</h1>
					<p>در ساخت رمز جدید نکات ایمنی را رعایت کنید</p>
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
						<FormControl
							sx={{
								color: "text.primary",
								width: 1,
								maxWidth: { xs: "100%", sm: "70%", md: "60%" },
								marginX: "auto",
							}}>
							<FormLabel sx={{ color: "text.primary" }}>رمز عبور</FormLabel>
							<Input
								{...register("password", { required: true })}
								placeholder={showPass ? "123456" : "*********"}
								type={showPass ? "text" : "password"}
								variant="soft"
								sx={{ fontSize: 16 }}
								className="ltr"
							/>
							{showPass ? (
								<VisibilityOffIcon
									sx={{ fontSize: 15 }}
									className="cursor-pointer absolute right-1 top-[57%] text-gray-500"
									onClick={() => setShowPass(!showPass)}
								/>
							) : (
								<VisibilityIcon
									sx={{ fontSize: 15 }}
									className="cursor-pointer absolute right-1 top-[57%] text-gray-500"
									onClick={() => setShowPass(!showPass)}
								/>
							)}
						</FormControl>

						<Button
							loading={isPending}
							disabled={!watchPassword || watchPassword === ""}
							type="submit"
							variant="soft"
							sx={{ width: "60%", marginX: "auto" }}>
							بازنشانی رمزعبور
						</Button>
					</form>
				</Box>
			) : (
				<div className="flex flex-col items-center gap-4">
					<h2 className="text-xl font-bold text-center">لینک شما معتبر نیست</h2>
					<Button variant="outlined">
						<Link to="/login">بازگشت به صفحه ورود</Link>
					</Button>
				</div>
			)}
		</Container>
	);
}
