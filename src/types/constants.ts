export const localUrl = 'http://localhost:5000';
export const brandUrl = 'https://quickshare.at';
export const brandUrlShort = 'https://qsh.at';
export const brandUrlShortDomain = 'qsh.at';
export const alternateBrandUrl = ['https://vietnamese.cloud', 'https://clickdi.top'] as const;
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';
export const cdnUrl = 'https://cdn.jsdelivr.net/gh/thanhdanh27600/quickshare@production/public';
export const cdn = (file: string) => `${isProduction ? cdnUrl : ''}${file}`;
export const isShortDomain = process.env.NEXT_PUBLIC_SHORT_DOMAIN === 'true';
export const allowedDomains = isProduction ? [brandUrl, brandUrlShort] : [localUrl, brandUrl, brandUrlShort];
export const Window = () => ('object' === typeof window && window ? (window as any) : undefined);

export const LIMIT_FEATURE_HOUR = 1;
export const LIMIT_FEATURE_SECOND = LIMIT_FEATURE_HOUR * 3600;
export const LIMIT_TOKEN_MILLISECOND = isProduction ? 3600e3 : 60e3;
export const LIMIT_SHORTENED_HOUR = 24;
export const LIMIT_SHORTENED_SECOND = LIMIT_SHORTENED_HOUR * 3600;
export const LIMIT_NOTE_HOUR = 168; // 7 days
export const LIMIT_NOTE_SECOND = LIMIT_NOTE_HOUR * 3600;
export const LIMIT_SHORTEN_REQUEST = 5;
export const LIMIT_NOTE_REQUEST = 5;
export const LIMIT_RECENT_HISTORY = 5;
export const LIMIT_OG_TITLE_LENGTH = 100;
export const LIMIT_NOTE_TITLE_LENGTH = 200;
export const LIMIT_OG_DESCRIPTION_LENGTH = 200;
export const OG_IMAGE_DIMENSION = '1200 x 630';
export const LIMIT_FILE_UPLOAD = 5 * 1024 * 1024; // 10MB

export const HASH = {
  Regex: /^.{3}$/,
  Length: 3,
};

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
export const BASE_URL_OG = isProduction ? 'https://og.quickshare.at' : 'http://localhost:7071';
export const REDIS_KEY = {
  LIMIT_SHORTEN: 'limitShort',
  LIMIT_NOTE: 'limitNote',
  MAP_SHORTEN_BY_HASH: 'hShort',
  MAP_NOTE_BY_HASH: 'hNote',
  OG_BY_HASH: 'og',
} as const;
type RedisKeys = keyof typeof REDIS_KEY;
type RedisKeyValues = (typeof REDIS_KEY)[RedisKeys];

export const getRedisKey = (key: RedisKeyValues, value: string) => {
  return `${key}:${value}`;
};

export const MIX_PANEL_TOKEN = process.env.NEXT_PUBLIC_MIX_PANEL_TOKEN;
export const PLATFORM_AUTH = process.env.NEXT_PUBLIC_PLATFORM_AUTH;
export const SERVER_AUTH = process.env.SERVER_AUTH;
export const TE = () => Window()?.te;
export const tinymce = (Window() as any)?.tinymce;
