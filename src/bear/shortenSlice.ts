import { UrlShortenerHistory } from '@prisma/client';
import { withDevTools } from 'bear/middleware';
import { BASE_URL_SHORT } from 'types/constants';
import { StateCreator, create } from 'zustand';

export interface ShortenSlice {
  shortenHistory?: Partial<UrlShortenerHistory>;
  setShortenHistory: (history?: Partial<UrlShortenerHistory>) => void;
  shortenHistoryForm?: Partial<UrlShortenerHistory>;
  setShortenHistoryForm: (history?: Partial<UrlShortenerHistory>) => void;
  getShortenUrl: () => string;
  getHash: () => string;
  shortenHistoryMediaId?: number;
  setShortenHistoryMediaId: (id: number) => void;
}

const slice: StateCreator<ShortenSlice> = (set, get) => ({
  shortenHistory: undefined,
  shortenHistoryForm: undefined,
  shortenHistoryMediaId: undefined,
  getShortenUrl: () => (!!get().shortenHistory ? `${BASE_URL_SHORT}/${get().shortenHistory?.hash}` : ''),
  getHash: () => (!!get().shortenHistory ? get().shortenHistory?.hash || '' : ''),

  setShortenHistory: (history) => set((state) => ({ shortenHistory: { ...state.shortenHistory, ...history } })),
  setShortenHistoryForm: (history) =>
    set((state) => ({ shortenHistoryForm: { ...state.shortenHistoryForm, ...history } })),
  setShortenHistoryMediaId: (id: number) => set({ shortenHistoryMediaId: id }),
});

const shortenSlice = create(withDevTools(slice, { anonymousActionType: 'ShortenSlice' }));

export default shortenSlice;
