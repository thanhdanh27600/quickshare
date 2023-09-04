import { Clipboard, Link } from '@styled-icons/feather';
import { useBearStore } from 'bear';
import { FeatureTabKey } from 'bear/utilitySlice';
import { Tabs } from 'components/atoms/Tabs';

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
  const { utilitySlice } = useBearStore();
  const [selectedKey, setSelectedKey] = utilitySlice((state) => [state.featureTab, state.setFeatureTab]);
  return (
    <Tabs selectedKey={selectedKey} setSelectedKey={setSelectedKey} tabs={tabs} className="ml-2 mb-2 border-b-0" />
  );
};
