const getEnv = (key: string, defaultValue?: string): string => {
	const value = process.env[key] || defaultValue;
	if (value === undefined) {
		throw new Error(`The env key- ${key} is missing`);
	}
	return value;
};

export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const NODE_ENV = getEnv("NODE_ENV");
export const PORT = getEnv("PORT", "5001");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
