import { Clipboard, Link } from '@styled-icons/feather';
import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { Tabs } from 'components/atoms/Tabs';
import { useRouter } from 'next/router';
import { isProduction } from 'types/constants';

const tabs = [
  {
    content: (
      <span className="flex items-center gap-2">
        <Link className="w-5" />
        Chia se Link
      </span>
    ),
    key: FeatureTabKey.SHARE_LINK,
  },
  {
    content: (
      <span className="flex items-center gap-2">
        <Clipboard className="w-5" />
        Chia se text
      </span>
    ),
    key: FeatureTabKey.SHARE_TEXT,
  },
];

export const ShareFeatureTabs = () => {
  const router = useRouter();
  const { utilitySlice } = useBearStore();
  const [selectedTab, setFeatureTab] = utilitySlice((state) => [state.featureTab, state.setFeatureTab]);

  const handleSelectTab = (tab: string) => {
    setFeatureTab(tab);
    if (router.asPath === '/note' && tab === FeatureTabKey.SHARE_LINK) {
      router.replace('/');
    }
    if (router.asPath === '/' && tab === FeatureTabKey.SHARE_TEXT) {
      router.replace('/note');
    }
  };

  if (isProduction) return null;

  return (
    <Tabs
      selectedKey={selectedTab}
      setSelectedKey={handleSelectTab}
      tabs={tabs}
      className="ml-2  -mt-4 mb-4 border-b-0 "
    />
  );
};
