import { Clipboard, Link } from '@styled-icons/feather';
import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { Tabs } from 'components/atoms/Tabs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { BASE_URL } from 'types/constants';
import { linkWithLanguage, useTrans } from 'utils/i18next';

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
  const { t, locale } = useTrans();
  const { utilitySlice } = useBearStore();
  const [selectedTab, setFeatureTab] = utilitySlice((state) => [state.featureTab, state.setFeatureTab]);

  const initTabs = () => {
    switch (router.pathname) {
      case '/note':
        setFeatureTab(FeatureTabKey.SHARE_TEXT);
        break;
      default:
      case '/':
        setFeatureTab(FeatureTabKey.SHARE_LINK);
        break;
    }
  };

  useEffect(() => {
    initTabs();
  }, []);

  useEffect(() => {
    initTabs();
  }, [router.pathname]);

  const handleSelectTab = (tab: string) => {
    if (router.pathname === '/note' && tab === FeatureTabKey.SHARE_LINK) {
      location.href = `${BASE_URL}/${locale}`;
    }
    if (router.pathname === '/' && tab === FeatureTabKey.SHARE_TEXT) {
      location.href = linkWithLanguage(`${BASE_URL}/note`, locale);
    }
  };

  return <Tabs selectedKey={selectedTab} setSelectedKey={handleSelectTab} tabs={tabs(t)} className="border-b-0 " />;
};
