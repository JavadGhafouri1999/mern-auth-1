import type { RequestHandler } from "express";
import appAssert from "../utils/AppAssert";
import { UNAUTHORIZED } from "../constants/httpStatus";
import AppErrorCode from "../constants/errorCode";
import { validateToken } from "../utils/jwtToken";
import type mongoose from "mongoose";

const authenticate: RequestHandler = (req, res, next) => {
	const accessToken = req.cookies.accessToken as string | undefined;
	appAssert(accessToken, UNAUTHORIZED, "Unauthorized", AppErrorCode.InvalidAccessToken);

	const { payload, error } = validateToken(accessToken);
	appAssert(payload, UNAUTHORIZED, "Invalid or Expired Access Token", AppErrorCode.InvalidAccessToken);

	req.userId = payload.userId as mongoose.Types.ObjectId;
	req.sessionId = payload.sessionId as mongoose.Types.ObjectId;

	next();
};

export default authenticate;
