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
    if (router.pathname === '/note' && tab === FeatureTabKey.SHARE_LINK) {
      location.href = '/';
    }
    if (router.pathname === '/' && tab === FeatureTabKey.SHARE_TEXT) {
      location.href = '/note';
    }
  };

  if (isProduction) return null;

  return (
    <Tabs
      selectedKey={selectedTab}
      setSelectedKey={handleSelectTab}
      tabs={tabs}
      className="-mt-4  mb-4 ml-2 border-b-0 "
    />
  );
};
