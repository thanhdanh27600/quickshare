import memoize from 'fast-memoize';
import { ForwardRs } from 'pages/api/forward';
import { QR } from 'pages/api/qr';
import { ShortenUrlRs } from 'pages/api/shorten';
import { Stats } from 'pages/api/stats/index';
import { stringify } from 'querystring';
import { API, withAuth } from './axios';

export const createShortenUrlRequest = async (url: string) => {
  const rs = await API.get(`/api/shorten?url=${url}`);
  const data = rs.data;
  return data as ShortenUrlRs;
};

export const getForwardUrl = async ({
  hash,
  userAgent,
  ip,
  fromClientSide,
}: {
  hash: string;
  userAgent?: string;
  ip?: string | null;
  fromClientSide?: boolean;
}) => {
  const rs = await API.post(`/api/forward`, { hash, userAgent, ip, fromClientSide });
  const data = rs.data;
  return data as ForwardRs;
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
      ...withAuth(),
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
