export const LIMIT_URL_HOUR = 1;
export const LIMIT_URL_SECOND = LIMIT_URL_HOUR * 3600;
export const LIMIT_URL_NUMBER = 5;
export const NUM_CHARACTER_HASH = 5;
export const brandUrl = 'https://clickdi.top';
export const brandUrlShort = 'https://clid.top';

export const Window = () => ('object' === typeof window && window ? (window as any) : undefined);
export const isProduction = process.env.NODE_ENV === 'production';
export const isShortDomain = Window()?.location.hostname === 'clid.top';

export const baseUrl = (useShortDomain: boolean = false) => {
  if (isProduction) {
    return useShortDomain ? brandUrlShort : brandUrl;
  }
  return typeof location === 'object'
    ? `${location.protocol}//` + location.hostname + (location.port ? ':' + location.port : '')
    : 'http://localhost:5000';
};
export const BASE_URL = baseUrl();
export const BASE_URL_SHORT = baseUrl(true);
export const REDIS_KEY = {
  HASH_LIMIT: 'limit',
  HASH_HISTORY_BY_ID: 'hHistory',
  HASH_SHORTEN_BY_HASHED_URL: 'hShort',
};

export const MIX_PANEL_TOKEN = process.env.NEXT_PUBLIC_MIX_PANEL_TOKEN;
export const PLATFORM_AUTH = process.env.NEXT_PUBLIC_PLATFORM_AUTH;
export const TE = () => Window()?.te;
