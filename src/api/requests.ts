import memoize from 'fast-memoize';
import { stringify } from 'querystring';
import { Forward } from 'types/forward';
import { Locale } from 'types/locale';
import { QR } from 'types/qr';
import { ShortenUrl } from 'types/shorten';
import { Stats } from 'types/stats';
import { API, withAuth } from './axios';

export const getOrCreateShortenUrlRequest = async ({ url, hash }: { url?: string; hash?: string }) => {
  const rs = await API.get(hash ? `/api/shorten?hash=${hash}` : `/api/shorten?url=${url}`);
  const data = rs.data;
  return data as ShortenUrl;
};

export const updateShortenUrlRequest = async ({
  hash,
  ogTitle,
  ogDescription,
  ogImgSrc,
  ogImgPublicId,
  mediaId,
  locale,
}: {
  hash: string;
  ogDescription?: string;
  ogTitle?: string;
  ogImgSrc?: string;
  ogImgPublicId?: string;
  mediaId?: number;
  locale: Locale;
}) => {
  const rs = await API.put(`/api/shorten/update`, {
    locale,
    hash,
    ogTitle,
    ogDescription,
    ogImgSrc,
    ogImgPublicId,
    mediaId,
  });
  const data = rs.data;
  return data as ShortenUrl;
};

export const getForwardUrl = async ({
  hash,
  locale,
  userAgent,
  ip,
  fromClientSide,
}: {
  hash: string;
  locale: string;
  userAgent?: string;
  ip?: string | null;
  fromClientSide?: boolean;
}) => {
  const rs = await API.post(`/api/forward`, { hash, locale, userAgent, ip, fromClientSide });
  const data = rs.data;
  return data as Forward;
};

export const getStats = async ({
  hash,
  email,
  password,
  token,
  queryCursor,
}: {
  hash: string;
  email?: string;
  password?: string;
  token?: string;
  queryCursor?: number;
}) => {
  const q = stringify({
    h: hash,
    ...(email ? { e: email } : null),
    ...(password ? { p: password } : null),
    ...(queryCursor ? { qc: queryCursor } : null),
  });
  const rs = await API.get(`/api/stats?${q}`, {
    headers: {
      ...withAuth(token),
    },
  });
  const data = rs.data;
  return data as Stats;
};

export const getStatsToken = async (h: string, p: string) => {
  const rs = await API.post(`/api/stats/verify`, { h, p });
  return rs.data as { token: string };
};

export const getQr = async (text: string, token: string) => {
  const rs = await API.get(`/api/qr?text=${text}`, {
    headers: {
      ...withAuth(token),
    },
  });
  const data = rs.data;
  return data as QR;
};

export const parseUA = memoize(async (ua: string) => {
  const rs = await API.get(`https://api.apicagent.com?ua=` + encodeURI(ua));
  const data = rs.data;
  return data;
});
