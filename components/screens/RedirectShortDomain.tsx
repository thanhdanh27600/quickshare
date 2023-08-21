import { useEffect } from 'react';
import { BASE_URL, BASE_URL_SHORT } from 'types/constants';

export const RedirectShortDomain = () => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = query.get('hash');
    if (hash) {
      window.location.href = `${BASE_URL_SHORT}/${hash}`;
    } else {
      window.location.href = BASE_URL;
    }
  }, []);
  return null;
};
