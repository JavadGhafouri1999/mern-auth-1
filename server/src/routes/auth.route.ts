import { Router, type Router as ExpressRouter } from "express";
import {
	loginHandler,
	logoutHandler,
	refreshHandler,
	registerHandler,
	verifyEmailHandler,
} from "../controllers/auth.controller";

// prefix => /auth
const authRoutes: ExpressRouter = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
// Refresh Token
authRoutes.get("/refresh", refreshHandler);
// email
authRoutes.get("/email/verify/:code", verifyEmailHandler);

export default authRoutes;
