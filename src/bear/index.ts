import { Window, isProduction } from 'types/constants';
import exampleSlice from './exampleSlice';
import shortenSlice from './shortenSlice';
import utilitySlice from './utilitySlice';

export const useBearStore = () => {
  const store = {
    exampleSlice,
    utilitySlice,
    shortenSlice,
  };

  if (!isProduction && Window()) {
    Window().bear = store;
  }

  return store;
};
