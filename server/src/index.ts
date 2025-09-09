import "dotenv/config";
import express from "express";
import { APP_ORIGIN, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import chalk from "chalk";
import authRoutes from "./routes/auth.route";
import userRoute from "./routes/user.route";
import authenticate from "./middleware/authenticate";
import sessionRoute from "./routes/session.route";

/* ------------------------------- App Configs ------------------------------ */

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(cookieParser());

/* --------------------------------- Routes --------------------------------- */

// Auth - Public
app.use("/auth", authRoutes);
// User & Others - Protected
app.use("/user", authenticate, userRoute);
app.use("/session", authenticate, sessionRoute);

/* ------------------------------- Middleware; ------------------------------ */

// When we write next(error) other middlewares deop the error to here so we can format it
app.use(errorHandler);

/* ------------------------------ Server Start ------------------------------ */

app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on ${PORT}\nuse ${chalk.yellow("postman")} to check the API Routes`);
});
