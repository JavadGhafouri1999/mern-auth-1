import QRCode from "qrcode";
import catchErrors from "../utils/catchErrors";
import { CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/httpStatus";
import {
	clearAuthCookies,
	getAccessTokenCookieOptions,
	getRefreshTokenCookieOptions,
	setAuthCookies,
} from "../utils/cookies";
import {
	emailSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
	twoFaTokenSchema,
	verificationSchema,
} from "./auth.schemas";
import { validateToken } from "../utils/jwtToken";
import SessionModel from "../models/session.model";
import appAssert from "../utils/AppAssert";
import AppErrorCode from "../constants/errorCode";
import UserModel from "../models/user.model";
import { authenticator } from "otplib";
import type { AuthenticationService } from "../services/auth.service";

/**
 *  Each (Most) controllers need 3 steps
 *  	1- Validate request (input - zod)
 *  	2- Call The related service(/s)
 *  	3- Return a response for the user
 */

export class AuthenticationController {
	constructor(private authService: AuthenticationService) {}
	// Register
	registerHandler = catchErrors(async (req, res) => {
		const request = registerSchema.parse({
			...req.body,
			userAgent: req.headers["user-agent"],
		});

		const { user, refreshToken, accessToken } = await this.authService.createAccount({
			...request,
			role: "user",
		});

		return setAuthCookies({ res, refreshToken, accessToken })
			.status(CREATED)
			.json({ message: "You signed up successfully!", user });
	});
	// Login
	loginHandler = catchErrors(async (req, res) => {
		const request = loginSchema.parse({ ...req.body, userAgent: req.headers["user-agent"] });

		const result = await this.authService.loginService(request);
		if (result.twoFARequired) {
			// No cookies yet — wait for OTP verification
			return res.status(OK).json(result);
		}

		return setAuthCookies({ res, refreshToken: result.refreshToken, accessToken: result.accessToken })
			.status(OK)
			.json({ message: "Logged In!", user: result.user });
	});
	// logout
	logoutHandler = catchErrors(async (req, res) => {
		const accessToken = req.cookies.accessToken as string | undefined;
		const { payload } = validateToken(accessToken || "");
		if (payload) {
			await SessionModel.findByIdAndDelete(payload.sessionId);
		}
		return clearAuthCookies(res).status(OK).json({ message: "Log out successful" });
	});
	// Refresher
	refreshHandler = catchErrors(async (req, res) => {
		const refreshToken = req.cookies.refreshToken as string | undefined;
		appAssert(refreshToken, UNAUTHORIZED, "There is no valid Token", AppErrorCode.InvalidRefreshToken);

		const { accessToken, newRefreshToken } = await this.authService.refreshUserAccessToken(refreshToken);

		if (newRefreshToken) {
			res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
		}
		return res
			.status(OK)
			.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
			.json({ message: "Access Token rfreshed" });
	});
	// Verify Email
	verifyEmailHandler = catchErrors(async (req, res) => {
		const verificationCode = verificationSchema.parse(req.params.code);

		await this.authService.verifyEmail(verificationCode);

		return res.status(OK).json({ message: "Verification completed" });
	});
	// Send password Reset
	sendPasswordResetHandler = catchErrors(async (req, res) => {
		const email = emailSchema.parse(req.body.email);

		await this.authService.sendPasswordResetEmail(email);

		return res.status(OK).json({ message: "Password reset link was sent" });
	});
	// Reset the password
	resetPasswordHandler = catchErrors(async (req, res) => {
		const request = resetPasswordSchema.parse(req.body);

		await this.authService.resetPassword(request);

		return clearAuthCookies(res).status(OK).json({ message: "Password reset successfully" });
	});
	// 2FA Setup
	setup2FA = catchErrors(async (req, res) => {
		const UserId = req.userId;
		const user = await UserModel.findById(UserId);
		appAssert(user, NOT_FOUND, "User was not found");

		const secret = authenticator.generateSecret();
		const otpauth = authenticator.keyuri(user.email, "myApp", secret);

		await UserModel.findByIdAndUpdate(UserId, { twoFactorSecret: secret });

		const qrImageUrl = await QRCode.toDataURL(otpauth);
		res.json({ qrImageUrl, manualKey: secret });
	});
	// 2FA Verify
	verify2FA = catchErrors(async (req, res) => {
		const { token } = twoFaTokenSchema.parse(req.body);
		const authHeader = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
		appAssert(authHeader, UNAUTHORIZED, "Unauthorized", AppErrorCode.InvalidAccessToken);

		const result = await this.authService.verify2FaService({ token, authHeader });

		if (result.mode === "login") {
			res.cookie("accessToken", result.accessToken, { httpOnly: true, sameSite: "strict" });
			res.cookie("refreshToken", result.refreshToken, { httpOnly: true, sameSite: "strict" });

			return res.status(OK).json({ message: "Login complete", user: result.user });
		}

		return res.status(OK).json({ message: "2FA enabled" });
	});
	// 2FA Reset
	reset2FA = catchErrors(async (req, res) => {});
}
