import { Router, type Router as ExpressRouter } from "express";
import {
	loginHandler,
	logoutHandler,
	refreshHandler,
	registerHandler,
	resetPasswordHandler,
	sendPasswordResetHandler,
	verifyEmailHandler,
} from "../controllers/auth.controller";

// prefix => /auth
const authRoutes: ExpressRouter = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
// Refresh Token
authRoutes.get("/refresh", refreshHandler);
// Email & Password
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
