export const LIMIT_URL_HOUR = 1;
export const LIMIT_URL_SECOND = LIMIT_URL_HOUR * 3600;
export const LIMIT_URL_NUMBER = 300;
export const NUM_CHARACTER_HASH = 5;
export const BASE_URL = () => {
	return "http://localhost:5000";
};
export const REDIS_KEY = {
	HASH_HISTORY_BY_ID: "hHistory",
	HASH_SHORTEN_BY_HASHED_URL: "hShort",
};
