import catchErrors from "../utils/catchErrors";
import { createAccount, loginService } from "../services/auth.service";
import { CREATED, OK } from "../constants/httpStatus";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "./auth.schemas";

/*
    Each (Most) controllers need 3 steps
    1- Validate request (input - zod)
    2- Call The related service(/s)
    3- Return a response for the user
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
