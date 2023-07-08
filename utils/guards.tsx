// PAGE GUARD
import { FC } from 'react';
import { Button } from '../components/atoms/Button';
import { brandUrl, isShortDomain } from '../types/constants';

interface Option {
  fullDomain?: boolean;
  returnIfFalse?: JSX.Element;
}

const DefaultNotFound = () => (
  <div className="mt-8 flex flex-col items-center justify-center">
    <p className="text-center">404 - PAGE NOT FOUND</p>
    <a href={brandUrl} className="mt-4">
      <Button text="Go to clickdi.top" />
    </a>
  </div>
);

export const pg = <T,>(Component: FC<T>, option?: Option) => {
  // Domain guard
  if (!!option && typeof option.fullDomain !== 'undefined') {
    if (option.fullDomain && isShortDomain) return option.returnIfFalse || DefaultNotFound;
    if (!option.fullDomain && !isShortDomain) return option.returnIfFalse || DefaultNotFound;
  }
  // Other guard
  // ...
  return Component;
};

export const pgFullDomain = <T,>(Component: FC<T>) => pg(Component, { fullDomain: true });
export const pgShortDomain = <T,>(Component: FC<T>) => pg(Component, { fullDomain: false });
