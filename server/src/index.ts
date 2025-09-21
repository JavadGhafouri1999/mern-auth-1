import "dotenv/config";
import express from "express";
import { APP_ORIGIN, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/auth.route";
import userRoute from "./routes/user.route";
import authenticate from "./middleware/authenticate";
import sessionRoute from "./routes/session.route";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

/* ---------------------------------- Build --------------------------------- */

if (process.env.NODE_ENV === "production") {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const rootDir = path.resolve(__dirname, "../..");

	app.use(express.static(path.join(rootDir, "client/dist")));

	// ✅ Express 5 safe catch-all
	app.get(/.*/, (_, res) => {
		res.sendFile(path.join(rootDir, "client/dist/index.html"));
	});
}

/* ------------------------------ Server Start ------------------------------ */

app.listen(PORT, async () => {
	await connectDB();
	console.log(`Click on http://localhost:${PORT}`);
});
