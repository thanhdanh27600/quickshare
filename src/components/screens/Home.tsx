import { FeatureTabKey } from 'bear/utilitySlice';
import { NoteSection } from 'components/sections/NoteSection';
import { UrlShortener } from 'components/sections/URLShortenerInput';

export const Home = ({ feature }: { feature: FeatureTabKey }) => {
  return (
    <div className="grid">
      {feature === FeatureTabKey.SHARE_LINK && <UrlShortener />}
      {feature === FeatureTabKey.SHARE_TEXT && <NoteSection />}
    </div>
  );
};
