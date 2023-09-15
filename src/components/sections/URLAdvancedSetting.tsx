import { Facebook, ThumbsUp, Twitter } from '@styled-icons/feather';
import { Accordion } from 'components/atoms/Accordion';
import { Tab, Tabs } from 'components/atoms/Tabs';
import { SettingPreviewUrlForm } from 'components/gadgets/SettingPreviewUrlForm';
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

export const URLAdvancedSetting = ({ defaultOpen = true }: { defaultOpen?: boolean; shortenUrl?: string }) => {
  const { t, locale } = useTrans();
  const [selectedKey, setSelectedKey] = useState(tabs[0]?.key);

  const title = (
    <span className="relative">
      {t('editPreview')}
      <span className="absolute -right-6 bottom-0 flex h-6 w-6 animate-bounce items-center justify-center rounded-full text-sm">
        <ThumbsUp className="w-4 text-cyan-500" />
      </span>
    </span>
  );

  return (
    <Accordion title={title} defaultOpen={defaultOpen} className="my-4">
      <div>
        <div className="my-4" />
        <Tabs tabs={tabs} selectedKey={selectedKey} setSelectedKey={setSelectedKey} />
        <URLSharePreview selectedKey={selectedKey} />
        <SettingPreviewUrlForm key={locale} />
      </div>
    </Accordion>
  );
};
