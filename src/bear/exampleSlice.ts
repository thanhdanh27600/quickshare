import { withDevTools } from 'bear/middleware';
import { StateCreator, create } from 'zustand';

export interface ExampleSlice {
  counter: number;
  increment: () => void;
}

const slice: StateCreator<ExampleSlice> = (set, get) => ({
  counter: 0,
  get2xCounter: () => get().counter * 2,
  increment: () => set((state) => ({ counter: state.counter + 1 })),
});

const exampleSlice = create(withDevTools(slice, { anonymousActionType: 'ExampleSlice' }));

export default exampleSlice;
