import { Box, Button, Container, FormControl, Input } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { sendPasswordEmail } from "../lib/api";
import { Link, useNavigate } from "react-router";
export default function ForgetPasswordPage() {
	const { register, handleSubmit, watch } = useForm<{ email: string }>();
	const navigate = useNavigate();
	const watchEmail = watch("email", "");

	// Email validation function
	const validateEmail = (email: string) => {
		if (!email) return "داشتن ایمیل الزامی است";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return "لطفا یک ایمیل معتبر وارد کنید";
		return true;
	};

	const errorTranslations: Record<string, string> = {
		"User not found": "حساب کاربری وجود ندارد یا غیرفعال شده",
		"Network Error or Server Unreachable": "خطا در اتصال به سرور",
		"Too maany request please try again later": "تعداد درخواست ها غیرمجاز  ",
		// Add more translations as needed
	};

	const { mutate: resetPassword, isPending } = useMutation({
		mutationFn: sendPasswordEmail,
		onSuccess: () => {
			toast.success("ایمیل بازیابی با موفقیت ارسال شد");
			navigate("/login");
		},
		onError: (error) => {
			const englishMessage = error?.message || "مشکلی در ارسال ایمیل بوجود آمد.";
			const errorMessage = errorTranslations[englishMessage] || englishMessage;
			toast.error(errorMessage);
		},
	});

	const onSubmit: SubmitHandler<{ email: string }> = (email) => resetPassword(email);

	return (
		<Container
			sx={{
				maxWidth: "sm",
				width: { xs: "90%", sm: "90%", md: 1 / 2, lg: 1 / 3 },
				borderRadius: "lg",
				padding: { xs: 2, md: 3 },
				backgroundColor: "background.surface",
				marginX: "auto",
				marginTop: 8,
				boxShadow: "md",
			}}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					maxWidth: "sm",
					marginX: "auto",
					textAlign: "center",
					justifyContent: "center",
					gap: 2,
					padding: 2,
				}}>
				<h1 className="text-2xl font-semibold">فراموشی رمزعبور</h1>
				<p>برای دریافت لینک بازنشانی ایمیل خودرا وارد کنید</p>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mx-auto w-full max-w-sm flex flex-col gap-4">
					<FormControl sx={{ width: "100%", fontSize: 24, marginX: "auto" }}>
						<Input
							{...register("email", {
								required: "داشتن ایمیل برای بازیابی رمز الزامی است",
								validate: validateEmail,
							})}
							placeholder="user@example.com"
							variant="soft"
							sx={{ maxWidth: "sm", fontSize: 16 }}
							className="ltr"
						/>
					</FormControl>
					<Button
						loading={isPending}
						disabled={!watchEmail || watchEmail === ""}
						type="submit"
						variant="soft"
						sx={{ width: "100%", marginX: "auto" }}>
						ارسال ایمیل
					</Button>
					<Link to="/login" className="text-sm text-blue-400 hover:text-blue-500 transition-colors">
						بازگشت به صفحه ورود
					</Link>
				</form>
			</Box>
		</Container>
	);
}
