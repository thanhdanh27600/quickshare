import { Note } from 'components/screens/Note';
import { UrlShortener } from 'components/screens/URLShortener';
import { Upload } from 'components/screens/Upload';
import { FeatureTabKey } from 'store/utilitySlice';
import { Landing } from './Landing';

export const Home = ({ feature }: { feature: FeatureTabKey }) => {
  return (
    <div className="grid">
      {feature === FeatureTabKey.SHARE_LINK && <UrlShortener />}
      {feature === FeatureTabKey.SHARE_FILE && <Upload />}
      {feature === FeatureTabKey.SHARE_TEXT && <Note />}
      <Landing />
    </div>
  );
};
