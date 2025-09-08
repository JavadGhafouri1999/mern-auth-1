import chalk from "chalk";
import type { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus";
import z, { ZodError } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

function handleZodError(res: Response, error: ZodError) {
	const prettyZodError = z.prettifyError(error);
	return res.status(BAD_REQUEST).json(prettyZodError);
}

function handleAppError(res: Response, error: AppError) {
	return res.status(error.statusCode).json({
		message: error.message,
		errorCode: error.errorCode,
	});
}

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
	// Log the path - method and error itself
	console.log(
		`\n-------------------------------\n${chalk.green("PATH:")} ${req.path} - ${chalk.blue("METHOD:")} ${
			req.method
		}\n${chalk.red("Error:")} ${error.message}\n-------------------------------\n`
	);

	// If an error happens while refreshing the tokens this clears all and then you can try
	if (req.path === REFRESH_PATH) {
		clearAuthCookies(res);
	}

	// Check for zod errors - (wrong inputs from user in the form)
	if (error instanceof ZodError) {
		return handleZodError(res, error);
	}

	if (error instanceof AppError) {
		return handleAppError(res, error);
	}

	return res.status(INTERNAL_SERVER_ERROR).json("Server Error");
};

export default errorHandler;
