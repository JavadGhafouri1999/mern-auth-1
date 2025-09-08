import type { Request, Response, NextFunction } from "express";
import { validateToken, type AccessTokenPayload } from "../utils/jwtToken";
import appAssert from "../utils/AppAssert";
import { UNAUTHORIZED } from "../constants/httpStatus";
import AppErrorCode from "../constants/errorCode";

// Extend Express Request to include `user`
export interface AuthenticatedRequest extends Request {
	user?: AccessTokenPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];

		appAssert(token, UNAUTHORIZED, "Token was not provided", AppErrorCode.UnauthorizedAccess);

		const { payload, error } = validateToken(token);

		appAssert(payload, UNAUTHORIZED, "Invalid Token", AppErrorCode.UnauthorizedAccess);

		req.user = payload; // now available in routes
		next();
	} catch (error) {
		next(error);
	}
}
