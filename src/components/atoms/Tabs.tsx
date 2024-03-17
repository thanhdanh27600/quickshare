import clsx from 'clsx';
import { ReactNode } from 'react';

export type Tab = {
  content: ReactNode;
  key: string;
  disabled?: boolean;
  hidden?: boolean;
};

interface Props {
  tabs: Tab[];
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  className?: string;
}

export const Tabs = (props: Props) => {
  const { tabs, selectedKey, setSelectedKey } = props;

  const handleClick = (tab: Tab) => (e: any) => {
    if (tab.disabled) return;
    setSelectedKey(tab.key);
  };

  return (
    <div className={clsx('border-b border-gray-200', props.className)}>
      <ul className="-mb-px flex flex-wrap text-center text-sm font-medium text-gray-500">
        {tabs.map((tab) => {
          if (tab.hidden) return;
          const selected = selectedKey === tab.key;
          return (
            <li className="mr-1 md:mr-2" key={`tab-${tab.key}`}>
              <button
                onClick={handleClick(tab)}
                className={clsx(
                  'group inline-flex items-center justify-center rounded-t-lg border-b-2 border-transparent p-2 py-2 transition-all md:p-4',
                  !tab.disabled && !selected && 'hover:border-gray-300 hover:bg-gray-100/40 hover:text-gray-600',
                  !tab.disabled &&
                    selected &&
                    '!border-cyan-500 bg-gray-100/60 text-cyan-500 hover:border-cyan-400 hover:text-cyan-400',
                  tab.disabled && 'cursor-not-allowed text-gray-400',
                )}>
                <div className={'text-xs md:text-base'}>{tab.content}</div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
