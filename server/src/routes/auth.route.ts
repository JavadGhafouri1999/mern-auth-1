import { Router, type Router as ExpressRouter } from "express";

import authenticate from "../middleware/authenticate";
import { AuthenticationService } from "../services/auth.service";
import { AuthenticationController } from "../controllers/auth.controller";
import UserModel from "../models/user.model";
import SessionModel from "../models/session.model";
import VerifyCodeModel from "../models/verifyCode.model";

// prefix => /auth
const authRoutes: ExpressRouter = Router();

const authService = new AuthenticationService(UserModel, SessionModel, VerifyCodeModel);
const authController = new AuthenticationController(authService);

authRoutes.post("/register", authController.registerHandler);
authRoutes.post("/login", authController.loginHandler);
authRoutes.get("/logout", authController.logoutHandler);
// 2FA
authRoutes.post("/2fa/setup", authenticate, authController.setup2FA);
authRoutes.post("/2fa/verify", authenticate, authController.verify2FA);
authRoutes.get("/2fa/reset", authenticate, authController.reset2FA);
// Refresh Token
authRoutes.get("/refresh", authController.refreshHandler);
// Email & Password
authRoutes.get("/email/verify/:code", authController.verifyEmailHandler);
authRoutes.post("/password/forgot", authController.sendPasswordResetHandler);
authRoutes.post("/password/reset", authController.resetPasswordHandler);

export default authRoutes;
