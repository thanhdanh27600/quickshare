import { Facebook, ThumbsUp, Twitter } from '@styled-icons/feather';
import { Accordion } from 'components/atoms/Accordion';
import { Tab, Tabs } from 'components/atoms/Tabs';
import { AdvancedSettingUrlForm } from 'components/gadgets/AdvancedSettingUrlForm';
import { Discord } from 'components/icons/Discord';
import { useState } from 'react';
import { useTrans } from 'utils/i18next';
import { URLSharePreview } from './URLSharePreview';

const tabs: Tab[] = [
  {
    content: (
      <span className="flex items-center gap-2">
        <Facebook className="w-5" />
        Facebook
      </span>
    ),
    key: 'Facebook',
  },
  {
    content: (
      <span className="flex items-center gap-2">
        <Twitter className="w-5" />
        Twitter
      </span>
    ),
    key: 'Twitter',
  },
  {
    content: (
      <span className="flex items-center gap-2">
        <Discord className="w-5" />
        Discord
      </span>
    ),
    key: 'Discord',
  },
];

export const URLAdvancedSetting = () => {
  const { t, locale } = useTrans();
  const [selectedKey, setSelectedKey] = useState(tabs[0]?.key);

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
      <div>
        <Tabs tabs={tabs} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
        <URLSharePreview selectedKey={selectedKey} />
        <AdvancedSettingUrlForm key={locale} />
        <hr className="my-8" />
      </div>
    </Accordion>
  );
};
