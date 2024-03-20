import memoize from 'fast-memoize';
import { stringify } from 'querystring';
import { FileRs } from 'types/file';
import { Forward } from 'types/forward';
import { Locale } from 'types/locale';
import { NoteRs } from 'types/note';
import { ShortenUrl } from 'types/shorten';
import { Stats, StatsGeo } from 'types/stats';
import {
  FileSchema,
  ForwardSchema,
  NoteSchema,
  PasswordSchema,
  UpdateNoteSchema,
  VerifyPasswordSchema,
} from 'utils/validateMiddleware';
import { API } from './api';

export const getOrCreateShortenUrlRequest = async ({
  url,
  hash,
  customHash,
}: {
  url?: string;
  hash?: string;
  customHash?: string;
}) => {
  const query = hash ? stringify({ hash }) : customHash ? stringify({ url, customHash }) : stringify({ url });
  const rs = await API.get(`/api/shorten?${query}`);
  const data = rs.data;
  return data as ShortenUrl;
};

export const updateShortenUrlRequest = async ({
  hash,
  ogTitle,
  ogDescription,
  ogImgSrc,
  ogImgPublicId,
  theme,
  mediaId,
  locale,
}: {
  hash: string;
  ogDescription?: string;
  ogTitle?: string;
  ogImgSrc?: string;
  ogImgPublicId?: string;
  theme?: string;
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
    theme,
    mediaId,
  });
  const data = rs.data;
  return data as ShortenUrl;
};

export const forwardUrl = async ({ hash, userAgent, ip, fromClientSide }: ForwardSchema) => {
  const rs = await API.post(`/api/forward`, { hash, userAgent, ip, fromClientSide });
  const data = rs.data;
  return data as Forward;
};

export const getStats = async ({
  hash,
  noBot,
  email,
  queryCursor,
}: {
  hash: string;
  email?: string; // todo
  token?: string;
  noBot?: boolean;
  queryCursor?: number;
}) => {
  const q = stringify({
    h: hash,
    noBot,
    ...(email ? { e: email } : null),
    ...(queryCursor ? { qc: queryCursor } : null),
  });
  const rs = await API.get(`/api/stats?${q}`);
  const data = rs.data;
  return data as Stats;
};

export const getStatsGeo = async ({ hash }: { hash: string }) => {
  const q = stringify({
    h: hash,
  });
  const rs = await API.get(`/api/stats/geo?${q}`);
  const data = rs.data;
  return data as StatsGeo;
};

export const setPasswordRequest = async (payload: PasswordSchema) => {
  const rs = await API.post(`/api/password`, payload);
};

export const verifyPasswordRequest = async (payload: VerifyPasswordSchema) => {
  const rs = await API.post(`/api/password/verify`, payload);
  return rs.data as { token: string };
};

export const parseUA = memoize(async (ua: string) => {
  const rs = await API.get(`https://api.apicagent.com?ua=` + encodeURI(ua));
  const data = rs.data;
  return data;
});

export const createNoteRequest = async (payload: NoteSchema) => {
  const rs = await API.post(`/api/note`, payload);
  const data = rs.data;
  return data as NoteRs;
};

export const updateNoteRequest = async (payload: UpdateNoteSchema) => {
  const rs = await API.put(`/api/note/update`, payload);
  const data = rs.data;
  return data as NoteRs;
};

export const getNoteRequest = async (hash: string, token?: string) => {
  const rs = await API.get(
    `/api/note?${stringify({
      hash,
      token,
    })}`,
  );
  const data = rs.data;
  return data as NoteRs;
};

export const createFileRequest = async (payload: FileSchema) => {
  const rs = await API.post(`/api/file`, payload);
  const data = rs.data;
  return data as FileRs;
};

export const getFileRequest = async (hash: string) => {
  const rs = await API.get(
    `/api/file?${stringify({
      hash,
    })}`,
  );
  const data = rs.data;
  return data as FileRs;
};
