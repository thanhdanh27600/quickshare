import { Window, isProduction } from 'types/constants';
import { UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import exampleSlice from './exampleSlice';
import shortenSlice from './shortenSlice';
import utilitySlice from './utilitySlice';

export const withDevTools = (slice: UseBoundStore<any>) => {
  Window()[slice] = slice;
  return devtools(slice, { enabled: !isProduction });
};

export const useBearStore = () => {
  return {
    exampleSlice,
    utilitySlice,
    shortenSlice,
  };
};
