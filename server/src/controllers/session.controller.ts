import z from "zod";
import AppErrorCode from "../constants/errorCode";
import { NOT_FOUND, OK } from "../constants/httpStatus";
import SessionModel from "../models/session.model";
import appAssert from "../utils/AppAssert";
import catchErrors from "../utils/catchErrors";

export const getSessionsHandler = catchErrors(async (req, res) => {
	const sessions = await SessionModel.find(
		{ userId: req.userId, expiresAt: { $gt: new Date() } },
		{
			_id: 1,
			userAgent: 1,
			createdAt: 1,
		},
		{
			sort: { createdAt: -1 },
		}
	);
	return res.status(OK).json(
		sessions.map((session) => ({
			...session.toObject(),
			...(session.id === req.sessionId && { iscurrent: true }),
		}))
	);
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
	const sessionId = z.string().min(1).max(24).parse(req.params.id);

	const deletedsession = await SessionModel.findOneAndDelete({
		_id: sessionId,
		userId: req.userId,
	});
	appAssert(deletedsession, NOT_FOUND, "Session not found");

	return res.status(OK).json({ message: "Session was deleted" });
});
