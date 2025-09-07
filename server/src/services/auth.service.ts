import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../constants/env";
import AppErrorCode from "../constants/errorCode";
import { CONFLICT, UNAUTHORIZED } from "../constants/httpStatus";
import VerifyCodeType from "../constants/verifyCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerifyCodeModel from "../models/verifyCode.model";
import appAssert from "../utils/AppAssert";
import resend from "../utils/email";
import { oneDayFromNow } from "../utils/timing";
import jwt from "jsonwebtoken";

/* ------------------------- Create Account Service ------------------------- */
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

export const createAccount = async (data: CreateAccountParams) => {
	// Check if we have this email already or not
	const existingUser = await UserModel.findOne({ email: data.email });

	appAssert(!existingUser, CONFLICT, "This email is already in use!", AppErrorCode.EmailAlreadyInUse);

	// Now we know this email is new this creates a new user
	const user = await UserModel.create({
		username: data.username,
		email: data.email,
		sex: data.sex,
		birth: data.birth,
		password: data.password,
		role: data.role,
	});
	const userId = user._id;

	// Create Verification code to send to user's email
	const code = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. "483729"
	const verifyUserCode = await VerifyCodeModel.create({
		userId,
		type: VerifyCodeType.EmailVerification,
		code,
		expiresAt: oneDayFromNow(),
	});

	// TODO:Send Verification Email
	// const { data, error } = await resend.emails.send({
	// 	from: "Acme <onboarding@resend.dev>",
	// 	to: ["delivered@resend.dev"],
	// 	subject: "hello world",
	// 	html: "<strong>it works!</strong>",
	// });

	// Create Session
	const newSession = await SessionModel.create({ userId, userAgent: data.userAgent });
	const sessionInfo = {
		sessionId: newSession._id,
	};
	// Create Refresh Token
	const refreshToken = jwt.sign(sessionInfo, JWT_REFRESH_SECRET, {
		audience: [user.role],
		expiresIn: "11d",
	});
	const accessToken = jwt.sign({ userId, ...sessionInfo }, JWT_ACCESS_SECRET, {
		audience: [user.role],
		expiresIn: "15m",
	});

	// Return all we need
	return { user: user.omitPassword(), refreshToken, accessToken };
};

/* ------------------------------ Login Service ----------------------------- */
export type LoginParams = {
	email: string;
	password: string;
	userAgent?: string | undefined;
};

export const loginService = async (data: LoginParams) => {
	// First check if the email exist

	const user = await UserModel.findOne({ email: data.email });
	appAssert(user, UNAUTHORIZED, "Invalid Credentials", AppErrorCode.InvalidCredentials);

	const userId = user._id;

	// Create a new Session for logged in user
	const session = await SessionModel.create({ userId, userAgent: data.userAgent });
	const SessionInfo = {
		sessionId: session._id,
	};
	// Refresh Token
	const refreshToken = jwt.sign(SessionInfo, JWT_REFRESH_SECRET, {
		audience: [user.role],
		expiresIn: "11d",
	});
	// Access Token
	const accessToken = jwt.sign({ userId, ...SessionInfo }, JWT_ACCESS_SECRET, {
		audience: [user.role],
		expiresIn: "15m",
	});

	return { user: user.omitPassword(), refreshToken, accessToken };
};
