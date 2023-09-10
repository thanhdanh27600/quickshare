// PAGE GUARD
import PageNotFound from 'pages/404';
import { FC } from 'react';
import { isShortDomain } from '../types/constants';

interface Option {
  fullDomain?: boolean;
  returnIfFalse?: FC | JSX.Element;
}

export const pg = <T,>(Component: FC<T>, option?: Option) => {
  // Domain guard
  if (!!option && typeof option.fullDomain !== 'undefined') {
    if (option.fullDomain && isShortDomain) return option.returnIfFalse ?? PageNotFound;
    if (!option.fullDomain && !isShortDomain) return option.returnIfFalse ?? PageNotFound;
  }
  // Other guard
  // ...
  return Component;
};

export const pgFullDomain = <T,>(Component: FC<T>, option?: Omit<Option, 'fullDomain'>) =>
  pg(Component, { fullDomain: true, ...option });
export const pgShortDomain = <T,>(Component: FC<T>, option?: Omit<Option, 'fullDomain'>) =>
  pg(Component, { fullDomain: false, ...option });
