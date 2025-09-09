import type { UserDocument } from "../models/user.model";

export type CreateAccountParams = {
	username: string;
	email: string;
	sex: "male" | "female";
	birth: string;
	password: string;
	confirmPassword: string;
	userAgent?: string | undefined;
	role: "user" | "assistant" | "admin";
};

export type LoginParams = {
	email: string;
	password: string;
	userAgent?: string | undefined;
};
export type LoginResult =
	| {
			user: ReturnType<UserDocument["omitPassword"]>;
			refreshToken: string;
			accessToken: string;
			twoFARequired?: false;
	  }
	| {
			user: ReturnType<UserDocument["omitPassword"]>;
			twoFARequired: true;
			tempToken: string;
	  };

export type ResetPasswordParams = {
	verificationCode: string;
	newPassword: string;
};

export type VerifyParams = {
	token: string;
	authHeader: string;
};
