import { isProduction } from 'types/constants';
import { UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import exampleSlice from './exampleSlice';
import shortenSlice from './shortenSlice';

export const withDevTools = (slice: UseBoundStore<any>) => devtools(slice, { enabled: !isProduction });

export const useBearStore = () => {
  return {
    exampleSlice,
    shortenSlice,
  };
};
