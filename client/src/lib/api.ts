import API from "../api/axios";

type LoginParams = {
	email: string;
	password: string;
};

export const login = async (data: LoginParams) => {
	return API.post("/auth/login", data);
};

type SignupParams = LoginParams & {
	username: string;
	sex: "male" | "female";
	birth: string | null;
	confirmPassword: string;
};

export const signup = async (data: SignupParams) => {
	return API.post("/auth/register", data);
};

export const sendPasswordEmail = async (data: { email: string }) => {
	return API.post("/auth/password/forgot", data);
};

type ResetPasswordData = {
	code: string;
	password: string;
};

export const resetPassword = async ({ code, password }: ResetPasswordData) => {
	return API.post("/auth/password/reset", { verificationCode: code, newPassword: password });
};

export const verifyEmail = async (verificationCode: string) => {
	return API.get(`/auth/email/verify/${verificationCode}`);
};

type UserData = {
	_id: string;
	email: string;
	username: string;
	sex: string;
	birth: string;
	role: string;
	profileImage: string;
	verified: boolean;
	createdAt: string;
	updatedAt: string;
};

export const getUser = async (): Promise<UserData> => {
	return API.get("/user");
};

export const logout = async () => {
	return API.get("/auth/logout");
};
