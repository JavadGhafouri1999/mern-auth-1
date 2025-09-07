import jwt from "jsonwebtoken";
import type { UserDocument } from "./../models/user.model";
import type { SignOptions, VerifyOptions } from "jsonwebtoken";
import type { SessionDocument } from "../models/session.model";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../constants/env";

type signOptionsAndSecret = SignOptions & { secret: string };

export type RefreshTokenPayload = {
	sessionId: SessionDocument["_id"];
};
export type AccessTokenPayload = {
	userId: UserDocument["_id"];
	sessionId: SessionDocument["_id"];
};

const defaults: SignOptions = {
	audience: ["user"],
};

const verifyDefaults: VerifyOptions = {
	audience: "user", // must be string or tuple for verifying
};

export const AccessTokenSignOptions: signOptionsAndSecret = {
	expiresIn: "15m",
	secret: JWT_ACCESS_SECRET,
};

export const RefreshTokenSignOptions: signOptionsAndSecret = {
	expiresIn: "11d",
	secret: JWT_REFRESH_SECRET,
};

export const signToken = (
	payload: RefreshTokenPayload | AccessTokenPayload,
	options?: signOptionsAndSecret
) => {
	const { secret, ...SignOpts } = options || AccessTokenSignOptions;
	return jwt.sign(payload, secret, {
		...defaults,
		...SignOpts,
	});
};

export const validateToken = <TPayload extends object = AccessTokenPayload>(
	token: string,
	options?: VerifyOptions & { secret: string }
) => {
	const { secret = JWT_ACCESS_SECRET, ...verfyOpts } = options || {};
	try {
		const payload = jwt.verify(token, secret, {
			...verifyDefaults,
			...verfyOpts,
		}) as TPayload;
		return { payload };
	} catch (error: any) {
		return { error: error.message };
	}
};
