import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { ShareFeatureTabs } from 'components/gadgets/ShareFeatureTabs';
import { UrlShortener } from 'components/sections/URLShortenerInput';
import dynamic from 'next/dynamic';

const NoteInput = dynamic(() => import('../sections/NoteInput').then((c) => c.NoteInput), { ssr: false });

export const URLShortener = () => {
  const { utilitySlice } = useBearStore();
  const [selectedTab] = utilitySlice((state) => [state.featureTab]);

  return (
    <div className="grid">
      <ShareFeatureTabs />
      {selectedTab === FeatureTabKey.SHARE_LINK && <UrlShortener />}
      {selectedTab === FeatureTabKey.SHARE_TEXT && <NoteInput />}
    </div>
  );
};
