import mongoose from "mongoose";
import { compareValues, hashValue } from "../utils/hash";

export interface UserDocument extends mongoose.Document {
	username: string;
	email: string;
	sex: "male" | "female";
	role: "user" | "assistant" | "admin";
	birth: string;
	password: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(val: string): Promise<Boolean>;
	omitPassword(): Pick<
		UserDocument,
		"_id" | "email" | "username" | "sex" | "birth" | "role" | "verified" | "createdAt" | "updatedAt"
	>;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		email: { type: String, unique: true, required: true },
		username: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		sex: { type: String, enum: ["male", "female"], required: true },
		birth: { type: String, required: true },
		role: { type: String, enum: ["user", "assistant", "admin"], required: true, default: "user" },
		verified: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await hashValue(this.password);
	next();
});

userSchema.methods.comparePassword = async function (val: string) {
	return compareValues(val, this.password);
};

userSchema.methods.omitPassword = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
