import { NODE_ENV } from "./../constants/env";
import type { CookieOptions, Response } from "express";
import { elevenDaysFromNow, tenMinsFromNow } from "./timing";

type Params = {
	res: Response;
	refreshToken: string;
	accessToken: string;
};

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
	sameSite: "strict",
	httpOnly: true,
	secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: tenMinsFromNow(),
});

const getRefreshTokenCookieOptions = (): CookieOptions => ({
	...defaults,
	expires: elevenDaysFromNow(),
	path: "/auth/refresh",
});

export const setAuthCookies = ({ res, refreshToken, accessToken }: Params) => {
	return res
		.cookie("accessToken", accessToken, getAccessTokenCookieOptions())
		.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};
