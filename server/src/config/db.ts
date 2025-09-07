import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

export default async function connectDB() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Database connected");
	} catch (error) {
		console.log("Something went wrong wiht database:\n", error);

		//? Shut down server if can't conenct to database
		process.exit(1);
	}
}
