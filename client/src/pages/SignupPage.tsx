import { useState } from "react";
import Input from "@mui/joy/Input";
import { Link, useNavigate } from "react-router";
import JoyV6Field from "../components/DatePicker";
import ThemeToggle from "../components/ThemeToggle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button, FormControl, FormLabel, Option, Select, Stack, Typography, Box, Container } from "@mui/joy";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Dayjs } from "dayjs";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../lib/api";

type InputTypes = {
	username: string;
	email: string;
	sex: "male" | "female";
	birth: Dayjs | null;
	password: string;
	confirmPassword: string;
};

export default function SignupPage() {
	const [showPass, setShowPass] = useState(false);
	const navigate = useNavigate();
	const { control, register, handleSubmit, watch } = useForm<InputTypes>({ mode: "onSubmit" });

	const watchFields = watch();

	const errorTranslations: Record<string, string> = {
		"This email is already in use!": "این ایمیل قبلاً استفاده شده است!",
		"This username is already in use": "این نام کاربری قبلاً استفاده شده است!",
		"Network Error or Server Unreachable": "خطا در اتصال به سرور",
		// Add more translations as needed
	};

	const { mutate: signUp, isPending } = useMutation({
		mutationFn: signup,
		onSuccess: () => {
			toast.success("حساب کاربری با موفقیت ساخته شد");
			navigate("/");
		},
		onError: (error) => {
			const englishMessage = error?.message || "مشکلی در ساخت حساب بوجود آمد.";
			const errorMessage = errorTranslations[englishMessage] || englishMessage;
			toast.error(errorMessage);
		},
	});

	const onError = (errors: Record<string, unknown>) => {
		Object.values(errors).forEach((error) => {
			if (
				error &&
				typeof error === "object" &&
				"message" in error &&
				typeof error.message === "string"
			) {
				toast.error(error.message);
			}
		});
	};

	// Password validation function
	const validatePassword = (password: string) => {
		if (!password) return "رمزعبور شما خالی است";
		if (password.length < 6) return "رمزعبور باید حداقل 6 حرفی باشد";
		if (!/[A-Z]/.test(password)) return "رمزعبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد";
		if (!/[0-9]/.test(password)) return "رمزعبور باید حداقل یک عدد داشته باشد";
		return true;
	};

	const validUsername = (userName: string) => {
		if (!userName) return "نام کاربری شما خالی است";

		// Check if username contains only English letters and numbers
		if (!/^[a-zA-Z0-9]+$/.test(userName)) return "نام کاربری فقط می‌تواند شامل حروف انگلیسی و اعداد باشد";

		// Check if username starts with a number
		if (/^[0-9]/.test(userName)) return "نام کاربری نمی‌تواند با عدد شروع شود";

		// Check minimum length (assuming at least 3 characters)
		if (userName.length < 3) return "نام کاربری باید حداقل 3 کاراکتر باشد";

		// Check maximum length (assuming maximum 20 characters)
		if (userName.length > 20) return "نام کاربری نمی‌تواند بیشتر از 20 کاراکتر باشد";

		return true;
	};

	const confirmPass = (confirmPassword: string) => {
		if (confirmPassword === "") return "تکرار رمزعبور خالی است";
		if (watchFields.password !== confirmPassword) return "رمزعبور مطابق تکرار آن نیست";
		return true;
	};

	// Email validation function
	const validateEmail = (email: string) => {
		if (!email) return "داشتن ایمیل الزامی است";
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) return "لطفا یک ایمیل معتبر وارد کنید";
		return true;
	};

	const isFormValid = () => {
		return (
			watchFields.username?.trim() !== "" &&
			watchFields.email?.trim() !== "" &&
			watchFields.password?.trim() !== "" &&
			watchFields.confirmPassword?.trim() !== "" &&
			watchFields?.birth !== null
		);
	};
	const onSubmit: SubmitHandler<InputTypes> = (data) => {
		signUp({
			...data,
			birth: data.birth
				? typeof data.birth === "string"
					? data.birth
					: data.birth.format("YYYY-MM-DD")
				: "",
		});
	};

	return (
		<Container
			sx={{
				flex: 1,
				display: "flex",
				justifyContent: "space-between",
				borderRadius: "lg",
				width: 1,
				maxWidth: { xs: "90%", sm: "sm", md: "md" },
				padding: { xs: 1, md: 2 },
				backgroundColor: "background.surface",
				marginX: 3,
				gap: 2,
				boxShadow: "md",
			}}>
			{/* Right - Form */}
			<Box
				sx={{
					width: { xs: "100%", md: 1 / 2 },
					display: "flex",
					flexDirection: "column",
					borderRadius: 4,
					padding: 1,
					overflow: "hidden",
					gap: 3,
				}}>
				<div className="w-full flex items-center justify-between gap-4">
					<svg
						width="67"
						height="41"
						viewBox="0 0 67 41"
						fill="background.surface"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M45.0353 4.66312C45.8331 3.77669 46.7195 3.04539 47.6281 2.46921C49.2236 1.47198 50.9079 0.940125 52.6364 0.940125V15.411C51.3732 11.0232 48.6475 7.25591 45.0353 4.66312ZM66.5533 40.9401H15.2957C6.87461 40.9401 0.0712891 34.1146 0.0712891 25.7157C0.0712891 17.6714 6.3206 11.0675 14.232 10.5135V0.940125C16.0048 0.940125 17.7555 1.44982 19.3954 2.46921C20.304 3.02323 21.1904 3.75453 21.9882 4.59663C25.2458 2.31409 29.1904 0.984446 33.4674 0.984446C33.4674 10.2254 30.1433 20.9734 19.3289 20.9955H33.3566C32.9577 19.2005 31.3178 17.8709 29.3677 17.8487H37.5228C35.5727 17.8487 33.9328 19.2005 33.5339 21.0177H46.6087C49.2236 21.0177 51.8164 21.5274 54.2541 22.5468C56.6696 23.544 58.8857 25.0288 60.725 26.8681C62.5865 28.7296 64.0491 30.9235 65.0464 33.339C66.0436 35.7324 66.5533 38.3252 66.5533 40.9401ZM22.8525 10.7795C23.1849 11.6437 24.0713 12.6188 25.3123 13.3279C26.5533 14.0371 27.8386 14.3252 28.7472 14.1922C28.4148 13.3279 27.5284 12.3529 26.2874 11.6437C25.0464 10.9346 23.761 10.6465 22.8525 10.7795ZM41.5117 13.3279C40.2707 14.0371 38.9854 14.3252 38.0768 14.1922C38.4092 13.3279 39.2957 12.3529 40.5367 11.6437C41.7777 10.9346 43.063 10.6465 43.9716 10.7795C43.6613 11.6437 42.7527 12.6188 41.5117 13.3279Z"
							fill="#fff"></path>
					</svg>
					<ThemeToggle />
					<p className="text-2xl font-black">LOGO</p>
				</div>
				<h1 className="w-full text-xl md:text-2xl font-bold text-center mt-2">ساخت حساب</h1>
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className="h-full flex flex-col gap-5 w-full px-8 mx-auto mb-6 md:mb-0">
					{/* Inputs */}
					<Stack direction="column" spacing={2} sx={{ width: "100%", maxWidth: "sm" }}>
						{/* Username */}
						<FormControl sx={{ maxWidth: "sm", fontSize: 24 }}>
							<FormLabel sx={{ color: "text.primary" }}>نام کاربری</FormLabel>
							<Input
								{...register("username", {
									required: "داشتن نام کاربری الزامی است",
									validate: validUsername,
								})}
								placeholder="username_1"
								variant="soft"
								sx={{ maxWidth: "sm", fontSize: 16 }}
								className="ltr"
							/>
						</FormControl>
						{/* Email */}
						<FormControl sx={{ maxWidth: "sm", fontSize: 24 }}>
							<FormLabel sx={{ color: "text.primary" }}>آدرس ایمیل</FormLabel>
							<Input
								{...register("email", {
									required: "داشتن ایمیل الزامی است",
									validate: validateEmail,
								})}
								placeholder="user@example.com"
								variant="soft"
								sx={{ maxWidth: "sm", fontSize: 16 }}
								className="ltr"
							/>
						</FormControl>
						{/* Birth and Gender */}
						<div className="max-w-full flex items-center gap-1 justify-between">
							<FormControl sx={{ width: "100%" }}>
								<FormLabel sx={{ color: "text.primary" }}>جنسیت</FormLabel>
								<Controller
									name="sex"
									control={control}
									defaultValue="male"
									rules={{ required: true }}
									render={({ field }) => (
										<Select
											value={field.value}
											onChange={(_, newValue) => field.onChange(newValue)}
											variant="soft">
											<Option value="male">مرد</Option>
											<Option value="female">زن</Option>
										</Select>
									)}
								/>
							</FormControl>
							<div className="flex flex-col max-w-fit">
								<FormLabel sx={{ color: "text.primary", fontSize: "sm" }}>
									تاریخ تولد
								</FormLabel>
								<Controller
									name="birth"
									control={control}
									defaultValue={null}
									rules={{ required: "تاریخ تولد الزامی است" }}
									render={({ field }) => (
										<JoyV6Field
											{...field}
											value={field.value}
											onChange={(newValue: Dayjs | null) => field.onChange(newValue)}
										/>
									)}
								/>
							</div>
						</div>
						{/* Passwords */}
						<FormControl sx={{ color: "text.primary" }}>
							<FormLabel sx={{ color: "text.primary" }}>رمز عبور</FormLabel>
							<Input
								{...register("password", {
									required: "داشتن رمزعبور مناسب الزامی است",
									validate: validatePassword,
								})}
								placeholder={showPass ? "123456" : "*********"}
								type={showPass ? "text" : "password"}
								variant="soft"
								sx={{ maxWidth: "sm", fontSize: 16 }}
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
						<FormControl sx={{ color: "text.primary" }}>
							<FormLabel sx={{ color: "text.primary" }}>تکرار رمز</FormLabel>
							<Input
								{...register("confirmPassword", {
									required: "تکرار رمزعبور الزامی است",
									validate: confirmPass,
								})}
								placeholder={showPass ? "123456" : "*********"}
								type={showPass ? "text" : "password"}
								variant="soft"
								sx={{ maxWidth: "sm", fontSize: 16 }}
								className="ltr"
							/>
						</FormControl>
					</Stack>
					{/* Sign-in */}
					<div className="flex items-center gap-2 text-sm">
						<Typography level="body-sm" sx={{ color: "text.primary" }}>
							حساب کاربری دارید؟
						</Typography>
						<Link to="/login" className="text-blue-400 hover:text-blue-500 transition-all">
							ورود به حساب
						</Link>
					</div>
					<Button
						loading={isPending}
						disabled={!isFormValid()}
						type="submit"
						variant="soft"
						sx={{ width: "100%" }}>
						ساخت حساب
					</Button>
				</form>
			</Box>
			{/* Left- Image */}
			<Box
				sx={{
					display: { xs: "none", md: "block" },
					height: "screen",
					width: 1 / 2,
					overflow: "hidden",
					borderRadius: 4,
				}}>
				<img src="./hands.jpg" alt="skull" className="h-full rounded-xl object-cover" />
			</Box>
		</Container>
	);
}
