import { Router, type Router as ExpressRouter } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controllers/auth.controller";

// prefix => /auth
const authRoutes: ExpressRouter = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);

export default authRoutes;
