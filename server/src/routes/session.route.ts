import { Router, type Router as ExpressRouter } from "express";
import { deleteSessionHandler, getSessionsHandler } from "../controllers/session.controller";

const sessionRoute: ExpressRouter = Router();

sessionRoute.get("/", getSessionsHandler);
sessionRoute.delete("/:id", deleteSessionHandler);

export default sessionRoute;
