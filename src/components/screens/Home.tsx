import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { Note } from 'components/screens/Note';
import { UrlShortener } from 'components/screens/URLShortener';
import { useEffect } from 'react';

export const Home = ({ feature, ip }: { feature: FeatureTabKey; ip: string }) => {
  const { utilitySlice } = useBearStore();
  const setIp = utilitySlice((state) => state.setIp);
  useEffect(() => {
    setIp(ip);
  }, [ip]);

  return (
    <div className="grid">
      {feature === FeatureTabKey.SHARE_LINK && <UrlShortener />}
      {feature === FeatureTabKey.SHARE_TEXT && <Note />}
    </div>
  );
};
