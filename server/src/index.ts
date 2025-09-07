import "dotenv/config";
import express from "express";
import { APP_ORIGIN, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import chalk from "chalk";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/httpStatus";
import authRoutes from "./routes/auth.route";

/* ------------------------------- App Configs ------------------------------ */

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(cookieParser());

app.get(
	"/health",
	catchErrors(async (_, res, next) => {
		return res.status(OK).json("Server is Up - Health Check path");
	})
);

app.use("/auth", authRoutes);

/* ------------------------ Error Handler Middleware ------------------------ */

// When we write next(error) other middlewares deop the error to here so we can format it
app.use(errorHandler);

/* ------------------------------ Server Start ------------------------------ */

app.listen(PORT, async () => {
	await connectDB();
	console.log(`Server is running on ${PORT}\nuse ${chalk.yellow("postman")} to check the API Routes`);
});
