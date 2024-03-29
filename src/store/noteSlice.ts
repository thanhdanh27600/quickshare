import { withDevTools } from 'store/middleware';
import { BASE_URL, BASE_URL_SHORT } from 'types/constants';
import { NoteWithMedia } from 'types/note';
import { StateCreator, create } from 'zustand';

export interface NoteSlice {
  note?: NoteWithMedia;
  setNote: (note?: NoteWithMedia) => void;
  getShortenUrl: () => string;
  getEditUrl: () => string;
}

const slice: StateCreator<NoteSlice> = (set, get) => ({
  note: undefined,

  setNote: (note) => set((state) => ({ note: { ...state.note, ...note } })),
  getShortenUrl: () => (!!get().note ? `${BASE_URL_SHORT}/${get().note?.hash}` : ''),
  getEditUrl: () => (!!get().note ? `${BASE_URL}/note?uid=${get().note?.uid}` : ''),
});

const noteSlice = create(withDevTools(slice, { anonymousActionType: 'NoteSlice' }));

export default noteSlice;
