import clsx from 'clsx';
import { ReactNode } from 'react';

export type Tab = {
  content: ReactNode;
  key: string;
  disabled?: boolean;
};

interface Props {
  tabs: Tab[];
  selectedKey: string;
  setSelectedKey: (key: string) => void;
}

export const Tabs = (props: Props) => {
  const { tabs, selectedKey, setSelectedKey } = props;

  const handleClick = (tab: Tab) => (e: any) => {
    if (tab.disabled) return;
    setSelectedKey(tab.key);
  };

  return (
    <div className="border-b border-gray-200 ">
      <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
        {tabs.map((tab) => {
          const selected = selectedKey === tab.key;
          return (
            <>
              <li className="mr-2" key={`tab-${tab.key}`}>
                <a
                  href={`#${tab.key}`}
                  onClick={handleClick(tab)}
                  className={clsx(
                    'group inline-flex items-center justify-center rounded-t-lg border-b-2 border-transparent p-4',
                    !tab.disabled && !selected && 'hover:border-gray-300 hover:text-gray-600',
                    !tab.disabled &&
                      selected &&
                      'border-cyan-500 text-cyan-500 hover:border-cyan-400 hover:text-cyan-400',
                    tab.disabled && 'cursor-not-allowed text-gray-400',
                  )}>
                  <div className={clsx()}>{tab.content}</div>
                </a>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};
