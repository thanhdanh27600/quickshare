import { Note } from 'components/screens/Note';
import { UrlShortener } from 'components/screens/URLShortener';
import { FeatureTabKey } from 'store/utilitySlice';

export const Home = ({ feature }: { feature: FeatureTabKey }) => {
  return (
    <div className="grid">
      {feature === FeatureTabKey.SHARE_LINK && <UrlShortener />}
      {feature === FeatureTabKey.SHARE_TEXT && <Note />}
    </div>
  );
};
