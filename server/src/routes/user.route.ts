import { Router, type Router as ExpressRouter } from "express";
import { getUserHandler } from "../controllers/user.controller";

const userRoute: ExpressRouter = Router();

userRoute.get("/", getUserHandler);

export default userRoute;
