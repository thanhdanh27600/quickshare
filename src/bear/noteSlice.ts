import { Note } from '@prisma/client';
import { withDevTools } from 'bear/middleware';
import { StateCreator, create } from 'zustand';

export interface NoteSlice {
  note?: Partial<Note>;
  setNote: (note?: Partial<Note>) => void;
}

const slice: StateCreator<NoteSlice> = (set, get) => ({
  note: undefined,
  setNote: (note) => set((state) => ({ note: { ...state.note, ...note } })),
});

const noteSlice = create(withDevTools(slice, { anonymousActionType: 'NoteSlice' }));

export default noteSlice;
