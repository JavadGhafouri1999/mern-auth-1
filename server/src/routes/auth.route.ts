import { Router, type Router as ExpressRouter } from "express";
import {
	loginHandler,
	logoutHandler,
	refreshHandler,
	registerHandler,
	resetPasswordHandler,
	sendPasswordResetHandler,
	verifyEmailHandler,
	setup2FA,
	verify2FA,
	reset2FA,
} from "../controllers/auth.controller";
import authenticate from "../middleware/authenticate";

// prefix => /auth
const authRoutes: ExpressRouter = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
// 2FA
authRoutes.post("/2fa/setup", authenticate, setup2FA);
authRoutes.post("/2fa/verify", authenticate, verify2FA);
authRoutes.get("/2fa/reset", authenticate, reset2FA);
// Refresh Token
authRoutes.get("/refresh", refreshHandler);
// Email & Password
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
