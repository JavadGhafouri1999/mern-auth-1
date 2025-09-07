import type { NextFunction, Request, Response } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;
/**
 ** Higher-order function(Takes functions as arg or return a function)
 * that wraps an async controller function to catch any errors
 * and pass them to the next middleware in the chain (errorHandler).
 *
 ** This function is used to avoid repetitive try-catch blocks in async route handlers.
 * Instead of wrapping each controller with try-catch, this utility does it automatically.
 *
 * @param controller - The async controller function to wrap
 * @returns A new async function that executes the controller and catches any errors
 */
const catchErrors =
	(controller: AsyncController): AsyncController =>
	async (req, res, next) => {
		try {
			await controller(req, res, next);
		} catch (error) {
			next(error);
		}
	};

export default catchErrors;
