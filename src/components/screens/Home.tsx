import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { Note } from 'components/screens/Note';
import { UrlShortener } from 'components/screens/URLShortener';

export const Home = ({ feature }: { feature: FeatureTabKey }) => {
  const { utilitySlice } = useBearStore();

  return (
    <div className="grid">
      {feature === FeatureTabKey.SHARE_LINK && <UrlShortener />}
      {feature === FeatureTabKey.SHARE_TEXT && <Note />}
    </div>
  );
};
