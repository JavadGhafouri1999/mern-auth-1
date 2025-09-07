import type AppErrorCode from "../constants/errorCode";
import type { HttpStatusCode } from "../constants/httpStatus";

class AppError extends Error {
	constructor(public statusCode: HttpStatusCode, public message: string, public errorCode?: AppErrorCode) {
		// this use the constructor of base Error class and asign the message to our app error
		super(message);
	}
}

export default AppError;
