export const LIMIT_URL_HOUR = 1;
export const LIMIT_URL_SECOND = LIMIT_URL_HOUR * 3600;
export const LIMIT_URL_NUMBER = 5;
export const NUM_CHARACTER_HASH = 5;
export const brandUrl = "https://clickdi.top";
export const BASE_URL = () => {
	const isProduction = process.env.NODE_ENV === "production";
	if (isProduction) return brandUrl;
	return "http://localhost:5000";
};
export const REDIS_KEY = {
	HASH_HISTORY_BY_ID: "hHistory",
	HASH_SHORTEN_BY_HASHED_URL: "hShort",
};
