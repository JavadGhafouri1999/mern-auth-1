import mongoose from "mongoose";
import type VerifyCodeType from "../constants/verifyCodeTypes";

// Careful this is the typescript typing not mongoose database typing
export interface VerifyCodeDocument extends mongoose.Document {
	userId: mongoose.Types.ObjectId;
	type: VerifyCodeType;
	code: string;
	createdAt: Date;
	expiresAt: Date;
}

const verifyCodeSchema = new mongoose.Schema<VerifyCodeDocument>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
	type: { type: String, required: true },
	code: { type: String, required: true },
	createdAt: { type: Date, default: Date.now(), required: true },
	expiresAt: { type: Date, required: true },
});

const VerifyCodeModel = mongoose.model<VerifyCodeDocument>(
	"VerifyCode",
	verifyCodeSchema,
	"verification_codes"
);

export default VerifyCodeModel;
