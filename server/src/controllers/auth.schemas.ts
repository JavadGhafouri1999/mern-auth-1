import z from "zod";

export const loginSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(6, "Password must be at least 6 chars")
		.max(32, "You don't need more 32 chars for password!"),
	userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
	.extend({
		username: z
			.string()
			.min(4, "Username can't be shorter than 4 chars")
			.max(16, "Username can't be longer than 16 chars"),
		sex: z.enum(["male", "female"]),
		birth: z.iso.date("Date format is wrong or Date is invalid"),
		confirmPassword: z.string().min(6).max(32),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.strict();
