import { useEffect, useState } from 'react';
import { BASE_URL } from 'types/constants';

export const Styles = ({ children }: { children: any }) => {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(true);
    const element = document.createElement('script');
    element.src = `${BASE_URL}/lib/fb.min.js`;
    document.head.appendChild(element);
  }, []);
  return load ? (
    <>
      {/* <Script src={`${BASE_URL}/lib/fb.min.js`} /> */}
      {children}
    </>
  ) : null;
};
