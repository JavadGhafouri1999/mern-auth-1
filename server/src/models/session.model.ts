import mongoose from "mongoose";
import { tenDaysFromNow } from "../utils/timing";

export interface SessionDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	userAgent?: string;
	createdAt: Date;
	expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	userAgent: { type: String },
	createdAt: { type: Date, required: true, default: Date.now() },
	expiresAt: { type: Date, default: tenDaysFromNow },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
