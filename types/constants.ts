export const LIMIT_URL_HOUR = 1;
export const LIMIT_URL_SECOND = LIMIT_URL_HOUR * 3600;
export const LIMIT_URL_NUMBER = 5;
export const NUM_CHARACTER_HASH = 5;
export const brandUrl = 'https://clickdi.top';
export const baseUrl = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) return brandUrl;
  // return 'https://99a2-58-187-186-116.ap.ngrok.io';
  return 'http://localhost:5000';
};
export const BASE_URL = baseUrl();
export const REDIS_KEY = {
  HASH_LIMIT: 'limit',
  HASH_HISTORY_BY_ID: 'hHistory',
  HASH_SHORTEN_BY_HASHED_URL: 'hShort',
};
