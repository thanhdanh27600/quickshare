export const localUrl = 'http://localhost:5000';
export const brandUrl = 'https://clickdi.top';
export const brandUrlShort = 'https://clid.top';
export const brandUrlShortDomain = 'clid.top';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const cdnUrl = 'https://cdn.jsdelivr.net/gh/thanhdanh27600/clickdi@production/public';
export const cdn = (file: string) => `${isProduction ? cdnUrl : ''}${file}`;
export const isShortDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN === 'true';
export const allowedDomains = isProduction ? [brandUrl, brandUrlShort] : [localUrl, brandUrl, brandUrlShort];
export const Window = () => ('object' === typeof window && window ? (window as any) : undefined);

export const LIMIT_URL_HOUR = 1;
export const LIMIT_URL_SECOND = LIMIT_URL_HOUR * 3600;
export const LIMIT_TOKEN_MILLISECOND = isProduction ? 3600e3 : 60e3;
export const LIMIT_SHORTENED_HOUR = 24;
export const LIMIT_SHORTENED_SECOND = LIMIT_SHORTENED_HOUR * 3600;
export const LIMIT_URL_REQUEST = 5;
export const LIMIT_RECENT_HISTORY = 5;
export const NUM_CHARACTER_HASH = 3;

export const baseUrl = (useShortDomain: boolean = false) => {
  if (isProduction) {
    return useShortDomain ? brandUrlShort : brandUrl;
  }
  return typeof location === 'object'
    ? `${location.protocol}//` + location.hostname + (location.port ? ':' + location.port : '')
    : localUrl;
};
export const BASE_URL = baseUrl();
export const BASE_URL_SHORT = baseUrl(true);
export const REDIS_KEY = {
  HASH_LIMIT: 'limit',
  HASH_HISTORY_BY_ID: 'hHistory',
  HASH_SHORTEN_BY_HASHED_URL: 'hShort',
} as const;
type RedisKeys = keyof typeof REDIS_KEY;
type RedisKeyValues = (typeof REDIS_KEY)[RedisKeys];

export const getRedisKey = (key: RedisKeyValues, value: string) => {
  return `${key}:${value}`;
};

export const MIX_PANEL_TOKEN = process.env.NEXT_PUBLIC_MIX_PANEL_TOKEN;
export const PLATFORM_AUTH = process.env.NEXT_PUBLIC_PLATFORM_AUTH;
export const SERVER_AUTH = process.env.NEXT_PUBLIC_SERVER_AUTH;
export const TE = () => Window()?.te;
