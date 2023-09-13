import { Window, isProduction } from 'types/constants';
import exampleSlice from './exampleSlice';
import noteSlice from './noteSlice';
import shortenSlice from './shortenSlice';
import utilitySlice from './utilitySlice';

const store = {
  exampleSlice,
  utilitySlice,
  shortenSlice,
  noteSlice,
};

if (!isProduction && Window()) {
  Window().bear = store;
}

export const useBearStore = () => {
  return store;
};
