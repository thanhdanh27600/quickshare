import { URLShortenerInput } from 'components/sections/URLShortenerInput';
import { URLStats } from 'components/sections/URLStatsInput';

export const URLShortener = () => {
  return (
    <div className="grid gap-16">
      <URLShortenerInput />
      <URLStats />
    </div>
  );
};
