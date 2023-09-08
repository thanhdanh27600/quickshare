import { Clipboard, Link } from '@styled-icons/feather';
import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { Tabs } from 'components/atoms/Tabs';
import { useRouter } from 'next/router';
import { isProduction } from 'types/constants';
import { useTrans } from 'utils/i18next';

const tabs = (t: any) => [
  {
    content: (
      <span className="flex items-center gap-2">
        <Link className="w-5" />
        {t('shareLink')}
      </span>
    ),
    key: FeatureTabKey.SHARE_LINK,
  },
  {
    content: (
      <span className="flex items-center gap-2">
        <Clipboard className="w-5" />
        {t('shareNote')}
      </span>
    ),
    key: FeatureTabKey.SHARE_TEXT,
  },
];

export const FeatureTabs = () => {
  const router = useRouter();
  const { t } = useTrans();
  const { utilitySlice } = useBearStore();
  const [selectedTab] = utilitySlice((state) => [state.featureTab, state.setFeatureTab]);

  const handleSelectTab = (tab: string) => {
    if (router.pathname === '/note' && tab === FeatureTabKey.SHARE_LINK) {
      location.href = '/';
    }
    if (router.pathname === '/' && tab === FeatureTabKey.SHARE_TEXT) {
      location.href = '/note';
    }
  };

  if (isProduction) return null;

  return <Tabs selectedKey={selectedTab} setSelectedKey={handleSelectTab} tabs={tabs(t)} className="border-b-0 " />;
};
