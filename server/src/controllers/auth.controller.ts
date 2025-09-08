import catchErrors from "../utils/catchErrors";
import {
	createAccount,
	loginService,
	refreshUserAccessToken,
	resetPassword,
	sendPasswordResetEmail,
	verifyEmail,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/httpStatus";
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
	verificationSchema,
} from "./auth.schemas";
import { validateToken } from "../utils/jwtToken";
import SessionModel from "../models/session.model";
import appAssert from "../utils/AppAssert";
import AppErrorCode from "../constants/errorCode";

/**
 *  Each (Most) controllers need 3 steps
 *  	1- Validate request (input - zod)
 *  	2- Call The related service(/s)
 *  	3- Return a response for the user
 */

export const registerHandler = catchErrors(async (req, res) => {
	// 1
	const request = registerSchema.parse({
		...req.body,
		userAgent: req.headers["user-agent"],
	});
	// 2
	const { user, refreshToken, accessToken } = await createAccount({ ...request, role: "user" });
	// 3
	return setAuthCookies({ res, refreshToken, accessToken })
		.status(CREATED)
		.json({ message: "You signed up successfully!", user });
});

export const loginHandler = catchErrors(async (req, res) => {
	const request = loginSchema.parse({ ...req.body, userAgent: req.headers["user-agent"] });

	const { user, refreshToken, accessToken } = await loginService(request);

	return setAuthCookies({ res, refreshToken, accessToken })
		.status(OK)
		.json({ message: "Logged In!", user });
});

export const logoutHandler = catchErrors(async (req, res) => {
	const accessToken = req.cookies.accessToken as string | undefined;
	const { payload } = validateToken(accessToken || "");
	if (payload) {
		await SessionModel.findByIdAndDelete(payload.sessionId);
	}
	return clearAuthCookies(res).status(OK).json({ message: "Log out successful" });
});

export const refreshHandler = catchErrors(async (req, res) => {
	const refreshToken = req.cookies.refreshToken as string | undefined;
	appAssert(refreshToken, UNAUTHORIZED, "There is no valid Token", AppErrorCode.InvalidRefreshToken);

	const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

	if (newRefreshToken) {
		res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
	}
	return res
		.status(OK)
		.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
		.json({ message: "Access Token rfreshed" });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
	const verificationCode = verificationSchema.parse(req.params.code);

	await verifyEmail(verificationCode);

	return res.status(OK).json({ message: "Verification completed" });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
	const email = emailSchema.parse(req.body.email);

	await sendPasswordResetEmail(email);

	return res.status(OK).json({ message: "Password reset link was sent" });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
	const request = resetPasswordSchema.parse(req.body);
	
	await resetPassword(request);

	return clearAuthCookies(res).status(OK).json({ message: "Password reset successfully" });
});
