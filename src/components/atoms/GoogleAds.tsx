import { useEffect } from 'react';
import { GOOGLE_ADS_CLIENT_ID, Window } from 'types/constants';

export const GoogleAdBanner = (props: any) => {
  useEffect(() => {
    if (!Window()) return;
    try {
      (Window().adsbygoogle = Window().adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{
        display: 'block',
        overflow: 'hidden',
      }}
      data-ad-client={GOOGLE_ADS_CLIENT_ID}
      {...props}
    />
  );
};
