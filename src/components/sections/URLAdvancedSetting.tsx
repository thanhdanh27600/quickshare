import { ThumbsUp } from '@styled-icons/feather';
import { Accordion } from 'components/atoms/Accordion';
import { AdvancedSettingUrlForm } from 'components/gadgets/AdvancedSettingUrlForm';
import { useTrans } from 'utils/i18next';
import { URLSharePreview } from './URLSharePreview';

export const URLAdvancedSetting = () => {
  const { t, locale } = useTrans();

  const title = (
    <span className="relative">
      {t('editPreview')}
      <span className="absolute bottom-0 -right-6 flex h-6 w-6 animate-bounce items-center justify-center rounded-full text-sm">
        <ThumbsUp className="w-4 text-cyan-500" />
      </span>
    </span>
  );

  return (
    <Accordion title={title}>
      <>
        <URLSharePreview />
        <AdvancedSettingUrlForm key={locale} />
        <hr className="my-8" />
      </>
    </Accordion>
  );
};
