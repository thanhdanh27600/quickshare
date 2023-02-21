import { URLShortenerInput } from 'components/sections/UrlShortenerInput';
import { URLStats } from 'components/sections/URLStatsInput';

export const URLShortener = () => {
  return (
    <div className="grid gap-16">
      <URLShortenerInput />
      <URLStats />
    </div>
  );
};
