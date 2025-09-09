import AppErrorCode from "../constants/errorCode";
import { NOT_FOUND, OK } from "../constants/httpStatus";
import UserModel from "../models/user.model";
import appAssert from "../utils/AppAssert";
import catchErrors from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
	const user = await UserModel.findById(req.userId);
	appAssert(user, NOT_FOUND, "User was not found", AppErrorCode.UserNotFound);
	return res.status(OK).json( user.omitPassword() );
});
