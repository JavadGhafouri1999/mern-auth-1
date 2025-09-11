import AppErrorCode from "../constants/errorCode";
import {
	BAD_REQUEST,
	CONFLICT,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND,
	TOO_MANY_REQUESTS,
	UNAUTHORIZED,
} from "../constants/httpStatus";
import VerifyCodeType from "../constants/verifyCodeTypes";
import SessionModel, { type SessionDocument } from "../models/session.model";
import UserModel, { type UserDocument } from "../models/user.model";
import VerifyCodeModel, { type VerifyCodeDocument } from "../models/verifyCode.model";
import appAssert from "../utils/AppAssert";

import {
	AccessTokenSignOptions,
	RefreshTokenSignOptions,
	signToken,
	validateToken,
	type RefreshTokenPayload,
} from "../utils/jwtToken";
import { fiveMinAgo, oneDayFromNow, tenDaysFromNow, tenMinsFromNow } from "../utils/timing";
import { sendMail } from "../utils/sendMail";
import { APP_ORIGIN } from "../constants/env";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emailTemplates";
import { hashValue } from "../utils/hash";
import { authenticator } from "otplib";
import type { Model, Types } from "mongoose";
import type {
	CreateAccountParams,
	LoginParams,
	LoginResult,
	ResetPasswordParams,
	VerifyParams,
} from "../types/auth.types";

export class AuthenticationService {
	constructor(
		private userModel: Model<UserDocument>,
		private sessionModel: Model<SessionDocument>,
		private verifyCodeModel: Model<VerifyCodeDocument>
	) {}
	/* ----------------------------- helper function ---------------------------- */

	private async userExist(email: string): Promise<boolean> {
		const user = await this.userModel.findOne({ email }).lean().exec();
		return !!user;
	}

	// We don not await here just send the promise to the called they await for it
	private async getUserbyEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).exec();
	}

	private createAccessToken(userId: Types.ObjectId, sessionId: Types.ObjectId, userRole: string) {
		return signToken(
			{ userId, sessionId },
			{
				...AccessTokenSignOptions,
				audience: [userRole],
			}
		);
	}

	private createRefreshToken(sessionId: Types.ObjectId, userRole: string) {
		return signToken(
			{ sessionId },
			{
				...RefreshTokenSignOptions,
				audience: [userRole],
			}
		);
	}

	/* -------------------------------- Services -------------------------------- */
	/**
	 * Creates a new user account with the provided user data
	 * @param userData - The data needed to create a new account
	 * @returns An object containing the created user (without password), refresh token, and access token
	 */
	createAccount = async (userData: CreateAccountParams) => {
		// Check if we have this email already or not
		const existingUser = await this.userExist(userData.email);
		appAssert(!existingUser, CONFLICT, "This email is already in use!", AppErrorCode.EmailAlreadyInUse);
		const existingUsername = await this.userModel.findOne({ username: userData.username });
		appAssert(
			!existingUsername,
			CONFLICT,
			"This username is already in use",
			AppErrorCode.EmailAlreadyInUse
		);

		// Now we know this email is new this creates a new user
		const user = await UserModel.create({
			username: userData.username,
			email: userData.email,
			sex: userData.sex,
			birth: userData.birth,
			password: userData.password,
			role: userData.role,
		});
		const userId = user._id;

		// Create Verification code to send to user's email
		const code = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. "483729"
		const verifyUserCode = await this.verifyCodeModel.create({
			userId,
			type: VerifyCodeType.EmailVerification,
			code,
			expiresAt: oneDayFromNow(),
		});

		// we can late addjust this email for sending 6-digit codes
		const url = `${APP_ORIGIN}/email/verify/${verifyUserCode._id}`;

		const { data, error } = await sendMail({
			to: user.email,
			...getVerifyEmailTemplate(url),
		});

		appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name}-${error?.message}`);

		// Create Session
		const session = await this.sessionModel.create({ userId, userAgent: userData.userAgent });

		// Generate authentication tokens
		const accessToken = this.createAccessToken(
			user._id as Types.ObjectId,
			session._id as Types.ObjectId,
			user.role
		);
		const refreshToken = this.createRefreshToken(session._id as Types.ObjectId, user.role);

		// Return all we need
		return { user: user.omitPassword(), refreshToken, accessToken };
	};

	loginService = async (data: LoginParams): Promise<LoginResult> => {
		// First check if the email exist

		const user = await this.getUserbyEmail(data.email);
		appAssert(user, UNAUTHORIZED, "Invalid Credentials", AppErrorCode.InvalidCredentials);

		const userId = user._id;

		const isPasswordValid = await user.comparePassword(data.password);
		appAssert(isPasswordValid, UNAUTHORIZED, "Invalid Credentials", AppErrorCode.InvalidCredentials);

		// Create a new Session for logged in user
		const session = await this.sessionModel.create({ userId, userAgent: data.userAgent });
		const sessionInfo = {
			sessionId: session._id,
		};

		// 4. If 2FA is enabled, return a short-lived token for verification
		if (user.is2FA) {
			const tempToken = signToken(
				{ userId, ...sessionInfo, twoFAPending: true },
				{ ...AccessTokenSignOptions, expiresIn: "5m" }
			);

			return {
				user: user.omitPassword(),
				twoFARequired: true,
				tempToken,
			};
		}

		// Generate authentication tokens
		const accessToken = this.createAccessToken(
			user._id as Types.ObjectId,
			session._id as Types.ObjectId,
			user.role
		);
		const refreshToken = this.createRefreshToken(session._id as Types.ObjectId, user.role);

		return { user: user.omitPassword(), refreshToken, accessToken };
	};

	refreshUserAccessToken = async (refreshToken: string) => {
		// find and validate the ref token from user request
		const { payload } = validateToken<RefreshTokenPayload>(refreshToken, {
			secret: RefreshTokenSignOptions.secret,
		});
		appAssert(payload, UNAUTHORIZED, "Invalid Refresh Token", AppErrorCode.InvalidRefreshToken);

		const now = Date.now();
		// Ref token has the session ID we use it to find the session
		const session = await this.sessionModel.findById(payload.sessionId);
		appAssert(
			session && session.expiresAt.getTime() > now,
			UNAUTHORIZED,
			"Session expired",
			AppErrorCode.UnauthorizedAccess
		);
		const user = await this.userModel.findById(session.userId);
		appAssert(user, NOT_FOUND, "User related to this session was not found");

		// refresh session if it expires in the next 24hrs
		const refreshTheSession = session.expiresAt.getTime() - now <= 24 * 60 * 60 * 1000;
		if (refreshTheSession) {
			session.expiresAt = tenDaysFromNow();
			await session.save();
		}
		// New ref token
		// Generate authentication tokens
		const accessToken = this.createAccessToken(session.userId, session._id as Types.ObjectId, user.role);
		const newRefreshToken = refreshTheSession
			? this.createRefreshToken(session._id as Types.ObjectId, user.role)
			: undefined;

		return { accessToken, newRefreshToken };
	};

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

	verifyEmail = async (code: string) => {
		const validCode = await VerifyCodeModel.findOne({
			_id: code,
			type: VerifyCodeType.EmailVerification,
			expiresAt: { $gt: new Date() },
		});
		appAssert(validCode, UNAUTHORIZED, "Invalid or expired Code", AppErrorCode.InvalidVerificationCode);

		const updatedUser = await this.userModel.findByIdAndUpdate(
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

	sendPasswordResetEmail = async (email: string) => {
		// Check if the email is in database
		const user = await this.getUserbyEmail(email);
		appAssert(user, BAD_REQUEST, "User not found", AppErrorCode.UserNotFound);
		const userId = user._id;

		// Rate limiter it checks if there is more than one code with current userId in database
		const fiveminago = fiveMinAgo();
		const count = await VerifyCodeModel.countDocuments({
			userId,
			type: VerifyCodeType.PasswordReset,
			createdAt: { $gt: fiveminago },
		});
		appAssert(count <= 1, TOO_MANY_REQUESTS, "Too maany request please try again later");
		// Create a new Reset code
		const expiresAt = tenMinsFromNow();
		const passwordResetCode = await VerifyCodeModel.create({
			userId,
			type: VerifyCodeType.PasswordReset,
			expiresAt,
		});
		// Email the reset code
		const url = `${APP_ORIGIN}/password/reset?code=${passwordResetCode._id}&exp=${expiresAt.getTime()}`;
		const { data, error } = await sendMail({
			to: user.email,
			...getPasswordResetTemplate(url),
		});
		appAssert(data?.id, INTERNAL_SERVER_ERROR, `${error?.name}-${error?.message}`);

		return { url, emailId: data.id };
	};

	/**
	 * This functionality actually does the reset thing
	 * the one above (Forget Password Email) just does some validation and sends email
	 * this one takes the contect from the link in email and reset the password
	 */
	resetPassword = async ({ verificationCode, newPassword }: ResetPasswordParams) => {
		// Check if the code is valid (exist and not expired)
		const validCode = await this.verifyCodeModel.findOne({
			_id: verificationCode,
			type: VerifyCodeType.PasswordReset,
			expiresAt: { $gt: new Date() },
		});
		appAssert(
			validCode,
			NOT_FOUND,
			"The reset code is invalid or expired",
			AppErrorCode.PasswordResetTokenExpired
		);

		// Hash the new password
		const hashedPassword = await hashValue(newPassword);

		// Update the user password - find the user by VerifyCode userId
		const updatedUser = await this.userModel.findByIdAndUpdate(
			validCode.userId,
			{
				password: hashedPassword,
			},
			{ new: true }
		);
		appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to update the password");

		await validCode.deleteOne();

		await this.sessionModel.deleteMany({
			userId: updatedUser._id,
		});

		return {
			user: updatedUser.omitPassword(),
		};
	};

	verify2FaService = async ({ token, authHeader }: VerifyParams) => {
		const { payload } = validateToken(authHeader);
		appAssert(payload, UNAUTHORIZED, "Inavild or expired shot token");

		const sessionInfo = {
			sessionId: payload.sessionId,
		};

		const user = await this.userModel.findById(payload.userId);
		appAssert(user, NOT_FOUND, "user was not found");
		appAssert(user.twoFactorSecret, BAD_REQUEST, "2FA not active");
		const userId = user._id;

		const isValid = authenticator.check(token, user.twoFactorSecret);
		appAssert(isValid, UNAUTHORIZED, "Invalid code");

		if (payload.twoFAPending) {
			// Refresh Token
			const refreshToken = this.createRefreshToken(payload.sessionId as Types.ObjectId, user.role);
			const accessToken = this.createAccessToken(
				userId as Types.ObjectId,
				payload.sessionId as Types.ObjectId,
				user.role
			);

			return { mode: "login", user: user.omitPassword(), accessToken, refreshToken };
		}

		// ENABLE MODE - just ativate the 2FA
		user.is2FA = true;
		await user.save();

		return { mode: "enable" };
	};
}
