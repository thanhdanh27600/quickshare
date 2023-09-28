import { UrlShortenerHistory } from '@prisma/client';
import { withDevTools } from 'store/middleware';
import { BASE_URL, BASE_URL_SHORT } from 'types/constants';
import { StateCreator, create } from 'zustand';

export interface ShortenSlice {
  shortenHistory?: Partial<UrlShortenerHistory>;
  setShortenHistory: (history?: Partial<UrlShortenerHistory>) => void;
  clearShortenHistory: () => void;
  getShortenUrl: () => string;
  getTrackingUrl: () => string;
  getHash: () => string;
  shortenHistoryMediaId?: number;
  setShortenHistoryMediaId: (id: number) => void;
}

const slice: StateCreator<ShortenSlice> = (set, get) => ({
  shortenHistory: undefined,
  shortenHistoryForm: undefined,
  shortenHistoryMediaId: undefined,
  getShortenUrl: () => (!!get().shortenHistory?.id ? `${BASE_URL_SHORT}/${get().shortenHistory?.hash}` : ''),
  getTrackingUrl: () => (!!get().shortenHistory?.id ? `${BASE_URL}/v/${get().shortenHistory?.hash}` : ''),
  getHash: () => (!!get().shortenHistory ? get().shortenHistory?.hash || '' : ''),
  setShortenHistory: (history) => set((state) => ({ shortenHistory: { ...state.shortenHistory, ...history } })),
  setShortenHistoryMediaId: (id: number) => set({ shortenHistoryMediaId: id }),
  clearShortenHistory: () => set({ shortenHistory: undefined }),
});

const shortenSlice = create(withDevTools(slice, { anonymousActionType: 'ShortenSlice' }));

export default shortenSlice;
