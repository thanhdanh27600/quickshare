import { HelpCircle } from '@styled-icons/feather';
import clsx from 'clsx';
import { Tooltip } from 'components/atoms/Tooltip';
import { useEffect, useState } from 'react';
import { useTrans } from 'utils/i18next';

interface Props {
  text: string;
}

export const HelpTooltip = ({ text }: Props) => {
  const { t } = useTrans();
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (show && !keep) {
      timeout = setTimeout(() => {
        setShow(false);
      }, 100);
    } else timeout = undefined;
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [show, keep]);

  return (
    <div
      className={'relative h-8 w-8'}
      onMouseEnter={() => {
        setShow(true);
        setKeep(true);
      }}
      onMouseLeave={() => {
        setKeep(false);
      }}>
      <div className={clsx('relative cursor-pointer text-gray-500 transition-colors', show && 'text-gray-800')}>
        <HelpCircle className="absolute left-1 top-0 w-6" />
      </div>
      <Tooltip show={show || keep}>
        <div
          onMouseLeave={() => {
            setShow(false);
            setKeep(false);
          }}
          onMouseEnter={() => {
            if (!show) {
              setShow(false);
              setKeep(false);
            }
          }}
          className="absolute left-4 top-8 w-[250px] -translate-x-[50%] border border-cyan-300 bg-gray-50 p-4 text-xs transition-all sm:w-[300px] sm:-translate-y-[50%] sm:translate-x-[20px] sm:text-sm lg:w-[400px]">
          <h2 className="whitespace-pre-line text-gray-700">{text}</h2>
        </div>
      </Tooltip>
    </div>
  );
};
