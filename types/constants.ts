export const LIMIT_URL_HOUR = 1;
export const LIMIT_URL_SECOND = LIMIT_URL_HOUR * 3600;
export const LIMIT_URL_NUMBER = 5;
export const NUM_CHARACTER_HASH = 5;
export const brandUrl = 'https://clickdi.top';

export const isProduction = process.env.NODE_ENV === 'production';

export const baseUrl = () => {
  if (isProduction) return brandUrl;
  return typeof location === 'object'
    ? `${location.protocol}//` + location.hostname + (location.port ? ':' + location.port : '')
    : 'http://localhost:5000';
};
export const BASE_URL = baseUrl();
export const REDIS_KEY = {
  HASH_LIMIT: 'limit',
  HASH_HISTORY_BY_ID: 'hHistory',
  HASH_SHORTEN_BY_HASHED_URL: 'hShort',
};

export const MIX_PANEL_TOKEN = process.env.NEXT_PUBLIC_MIX_PANEL_TOKEN;
