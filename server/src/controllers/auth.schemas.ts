import z from "zod";

export const emailSchema = z.email();

export const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 chars")
	.max(32, "You don't need more 32 chars for password!");

export const usernameSchema = z
	.string()
	.min(4, "Username can't be shorter than 4 chars")
	.max(16, "Username can't be longer than 16 chars");

export const verificationSchema = z.string().min(1).max(24);

export const twoFaTokenSchema = z.object({ token: z.string().min(1).max(6) });

export const resetPasswordSchema = z.object({
	verificationCode: z.string().min(1).max(24),
	newPassword: passwordSchema,
});

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
	.extend({
		username: usernameSchema,
		sex: z.enum(["male", "female"]),
		birth: z.iso.date("Date format is wrong or Date is invalid"),
		confirmPassword: z.string().min(6).max(32),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.strict();
