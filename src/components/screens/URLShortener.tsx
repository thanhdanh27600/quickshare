import { ShareFeatureTabs } from 'components/gadgets/ShareFeatureTabs';
import { URLShortenerInput } from 'components/sections/URLShortenerInput';
import { URLStats } from 'components/sections/URLStatsInput';
import { isProduction } from 'types/constants';

export const URLShortener = () => {
  return (
    <div className="grid">
      {!isProduction && <ShareFeatureTabs />}
      <URLShortenerInput />
      <URLStats />
    </div>
  );
};
