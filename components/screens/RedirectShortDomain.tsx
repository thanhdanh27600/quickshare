import { useEffect } from 'react';
import { BASE_URL, BASE_URL_SHORT } from 'types/constants';

export const RedirectShortDomain = () => {
  console.log('RedirectShortDomain run');
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    console.log('query', query);
    const hash = query.get('hash');
    console.log('hash', hash);
    if (hash) {
      window.location.href = `${BASE_URL_SHORT}/${hash}`;
    } else {
      window.location.href = BASE_URL;
    }
  }, []);
  return null;
};
