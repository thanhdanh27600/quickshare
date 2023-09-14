import { UrlShortenerHistory } from '@prisma/client';
import { withDevTools } from 'bear/middleware';
import { BASE_URL, BASE_URL_SHORT } from 'types/constants';
import { StateCreator, create } from 'zustand';

export interface ShortenSlice {
  shortenHistory?: Partial<UrlShortenerHistory>;
  setShortenHistory: (history?: Partial<UrlShortenerHistory>) => void;
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
  getShortenUrl: () => (!!get().shortenHistory ? `${BASE_URL_SHORT}/${get().shortenHistory?.hash}` : ''),
  getTrackingUrl: () => (!!get().shortenHistory ? `${BASE_URL}/v/${get().shortenHistory?.hash}` : ''),
  getHash: () => (!!get().shortenHistory ? get().shortenHistory?.hash || '' : ''),
  setShortenHistory: (history) => set((state) => ({ shortenHistory: { ...state.shortenHistory, ...history } })),
  setShortenHistoryMediaId: (id: number) => set({ shortenHistoryMediaId: id }),
});

const shortenSlice = create(withDevTools(slice, { anonymousActionType: 'ShortenSlice' }));

export default shortenSlice;
