import { Clipboard, File, Link as LinkIcon } from '@styled-icons/feather';
import { Tabs } from 'components/atoms/Tabs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useBearStore } from 'store';
import { FeatureTabKey } from 'store/utilitySlice';
import { BASE_URL } from 'types/constants';
import { Locale } from 'types/locale';
import { linkWithLanguage, useTrans } from 'utils/i18next';

const tabs = (t: any, locale: Locale) => [
  {
    content: (
      <Link href={'/'}>
        <span className="flex items-center gap-2">
          <LinkIcon className="w-5" />
          {t('shareLink')}
        </span>
      </Link>
    ),
    key: FeatureTabKey.SHARE_LINK,
  },

  {
    content: (
      <Link href={'/note'}>
        <span className="flex items-center gap-2">
          <Clipboard className="w-5" />
          {t('shareNote')}
        </span>
      </Link>
    ),
    key: FeatureTabKey.SHARE_TEXT,
  },
  {
    content: (
      <Link href={'/upload'}>
        <span className="flex items-center gap-2">
          <File className="w-5" />
          {t('uploadFile')}
        </span>
      </Link>
    ),
    key: FeatureTabKey.SHARE_FILE,
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
      case '/upload':
        setFeatureTab(FeatureTabKey.SHARE_FILE);
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
      location.href = linkWithLanguage(`${BASE_URL}/`, locale);
    }
    if (router.pathname === '/upload' && tab === FeatureTabKey.SHARE_FILE) {
      location.href = linkWithLanguage(`${BASE_URL}/upload`, locale);
    }
    if (router.pathname === '/' && tab === FeatureTabKey.SHARE_TEXT) {
      location.href = linkWithLanguage(`${BASE_URL}/note`, locale);
    }
  };

  return (
    <Tabs selectedKey={selectedTab} setSelectedKey={handleSelectTab} tabs={tabs(t, locale)} className="border-b-0 " />
  );
};
