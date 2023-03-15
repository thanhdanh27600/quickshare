import { URLShortenerInput } from 'components/sections/UrlShortenerInput';
import { URLStats } from 'components/sections/URLStatsInput';
import { useTrans } from 'utils/i18next';

export const URLShortener = () => {
  const { t } = useTrans();
  return (
    <div className="grid gap-16">
      <URLShortenerInput />
      <URLStats />
    </div>
  );
};
