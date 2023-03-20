export const PAGE_SIZE = 10;

export const withQueryCursor = (queryCursor?: number, takeAll?: boolean) => {
  return {
    cursor: queryCursor && queryCursor > 0 ? { id: queryCursor } : undefined,
    take: takeAll ? (queryCursor != null ? PAGE_SIZE : undefined) : PAGE_SIZE,
    skip: queryCursor && queryCursor > 0 ? 1 : 0,
  };
};

export const strictRefetch = {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchIntervalInBackground: false,
};
