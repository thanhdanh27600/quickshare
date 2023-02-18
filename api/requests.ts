import { ForwardRs } from 'pages/api/forward';
import { ShortenUrlRs } from 'pages/api/shorten';
import { API } from './axios';

export const createShortenUrlRequest = async (url: string) => {
  const rs = await API.get(`/api/shorten?url=${url}`);
  const data = await rs.data;
  return data as ShortenUrlRs;
};

export const getForwardUrl = async ({ hash, userAgent }: { hash: string; userAgent?: string }) => {
  const rs = await API.post(`/api/forward`, { hash, userAgent });
  const data = await rs.data;
  return data as ForwardRs;
};
