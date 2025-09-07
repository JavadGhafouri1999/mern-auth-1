import assert from "node:assert";
import AppErrorCode from "../constants/errorCode";
import type { HttpStatusCode } from "./../constants/httpStatus";
import AppError from "./AppError";

type AppAssert = (
	condition: any,
	httpStatusCode: HttpStatusCode,
	message: string,
	appErrorCode?: AppErrorCode
) => asserts condition;

/**
 * Asserts a acondition and throws an AppError if something goes wrong
 */

const appAssert: AppAssert = (condition, httpStatusCode, message, appErrorCode) =>
	assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
