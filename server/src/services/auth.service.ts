import AppErrorCode from "../constants/errorCode";
import { CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "../constants/httpStatus";
import VerifyCodeType from "../constants/verifyCodeTypes";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerifyCodeModel from "../models/verifyCode.model";
import appAssert from "../utils/AppAssert";
import resend from "../utils/resend";

import {
	AccessTokenSignOptions,
	RefreshTokenSignOptions,
	signToken,
	validateToken,
	type RefreshTokenPayload,
} from "../utils/jwtToken";
import { oneDayFromNow, tenDaysFromNow } from "../utils/timing";
import { sendMail } from "../utils/sendMail";
import { APP_ORIGIN } from "../constants/env";
import { getVerifyEmailTemplate } from "../utils/emailTemplates";

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

	// we can late addjust this email for sending 6-digit codes
	const url = `${APP_ORIGIN}/email/verify/${verifyUserCode._id}`;

	await sendMail({
		to: user.email,
		...getVerifyEmailTemplate(url),
	});

	// Create Session
	const session = await SessionModel.create({ userId, userAgent: data.userAgent });
	const sessionInfo = {
		sessionId: session._id,
	};

	// Refresh Token
	const refreshToken = signToken(
		{ userId, ...sessionInfo },
		{
			...RefreshTokenSignOptions,
			audience: [user.role],
		}
	);
	// Access Token
	const accessToken = signToken(
		{ userId, ...sessionInfo },
		{
			...AccessTokenSignOptions,
			audience: [user.role],
		}
	);

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
	const sessionInfo = {
		sessionId: session._id,
	};

	// Refresh Token
	const refreshToken = signToken(sessionInfo, {
		...RefreshTokenSignOptions,
		audience: [user.role],
	});

	// Access Token
	const accessToken = signToken(
		{ userId, ...sessionInfo },
		{
			...AccessTokenSignOptions,
			audience: [user.role],
		}
	);

	return { user: user.omitPassword(), refreshToken, accessToken };
};

/* -------------------------- Refresh Token Service ------------------------- */
export const refreshUserAccessToken = async (refreshToken: string) => {
	// find and validate the ref token from user request
	const { payload } = validateToken<RefreshTokenPayload>(refreshToken, {
		secret: RefreshTokenSignOptions.secret,
	});
	appAssert(payload, UNAUTHORIZED, "Invalid Refresh Token", AppErrorCode.InvalidRefreshToken);

	const now = Date.now();
	// Ref token has the session ID we use it to find the session
	const session = await SessionModel.findById(payload.sessionId);
	appAssert(
		session && session.expiresAt.getTime() > now,
		UNAUTHORIZED,
		"Session expired",
		AppErrorCode.UnauthorizedAccess
	);

	// refresh session if it expires in the next 24hrs
	const refreshTheSession = session.expiresAt.getTime() - now <= 24 * 60 * 60 * 1000;
	if (refreshTheSession) {
		session.expiresAt = tenDaysFromNow();
		await session.save();
	}
	// New ref token
	const newRefreshToken = refreshTheSession ? signToken({ sessionId: session._id }) : undefined;

	const accessToken = signToken({
		userId: session.userId,
		sessionId: session._id,
	});

	return { accessToken, newRefreshToken };
};

/* ------------------------------ Email Service ----------------------------- */
/**
 * 	This service dosen't have a route of it self
 * 	it sends veriftication email and password reset emails
 *
 *	Simple - Its a axync function gets a code(string)
 * 	it checks the code by searching the verify code model on our database
 *
 * 	we then get the userId and change its verified status to true
 *	then delete the verification code and return the user
 * */

export const verifyEmail = async (code: string) => {
	const validCode = await VerifyCodeModel.findOne({
		_id: code,
		type: VerifyCodeType.EmailVerification,
		expiresAt: { $gt: new Date() },
	});
	appAssert(validCode, UNAUTHORIZED, "Invalid or expired Code", AppErrorCode.InvalidVerificationCode);

	const updatedUser = await UserModel.findByIdAndUpdate(
		validCode.userId,
		{
			verified: true,
		},
		{ new: true }
	);
	appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify Email", AppErrorCode.ValidationError);
	await validCode.deleteOne();

	return { user: updatedUser.omitPassword() };
};
