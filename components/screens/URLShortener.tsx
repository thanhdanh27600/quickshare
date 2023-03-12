import { Accordion } from 'components/gadgets/Accordion';
import { URLShortenerInput } from 'components/sections/UrlShortenerInput';
import { URLStats } from 'components/sections/URLStatsInput';
import { useTrans } from 'utils/i18next';

export const URLShortener = () => {
  const { t } = useTrans();
  const title = [t('viewMore')];
  return (
    <div className="grid gap-16">
      <URLShortenerInput />
      <Accordion title={title}>
        <URLStats />
      </Accordion>
    </div>
  );
};
