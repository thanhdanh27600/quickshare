import { isProduction } from 'types/constants';
import { StateCreator } from 'zustand';
import { DevtoolsOptions, devtools } from 'zustand/middleware';

export const withDevTools = <T>(slice: StateCreator<T>, devtoolsOptions?: DevtoolsOptions) =>
  devtools(slice, { ...devtoolsOptions, enabled: !isProduction });
