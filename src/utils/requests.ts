export const PAGE_SIZE = 10;

export const withQueryCursor = (queryCursor?: number, takeAll?: boolean) => {
  return {
    cursor: queryCursor && queryCursor > 0 ? { id: queryCursor } : undefined,
    take: takeAll ? (queryCursor !== null ? PAGE_SIZE : undefined) : PAGE_SIZE,
    skip: queryCursor && queryCursor > 0 ? 1 : 0,
  };
};

export const strictRefetch = {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
};

export const QueryKey = {
  FORWARD: 'FORWARD',
  SET_PASSWORD: 'SET_PASSWORD',
  STATS: 'STATS',
  STATS_GEO: 'STATS_GEO',
  STATS_MORE: 'STATS_MORE',
  RECORD: 'RECORD',
  SHORTEN: 'SHORTEN',
  SHORTEN_UPDATE: 'SHORTEN_UPDATE',
  NOTE: 'NOTE',
  NOTE_GET: 'NOTE_GET',
  NOTE_UPDATE: 'NOTE_UPDATE',
  QR: 'QR',
  PARSE_UA: 'PARSE_UA',
  FILE: 'FILE',
};
