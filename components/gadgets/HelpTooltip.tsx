import { HelpCircle } from '@styled-icons/feather';
import clsx from 'clsx';
import { Tooltip } from 'components/atoms/Tooltip';
import { useEffect, useState } from 'react';
import { useTrans } from 'utils/i18next';

export const HelpTooltip = () => {
  const { t } = useTrans();
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(false);

  useEffect(() => {
    if (show && !keep) {
      setTimeout(() => {
        setShow(false);
      }, 500);
    }
  }, [show, keep]);

  return (
    <div
      className={'relative'}
      onMouseEnter={() => {
        setShow(true);
        setKeep(true);
      }}
      onMouseLeave={() => {
        setKeep(false);
      }}>
      <div className={clsx('relative cursor-pointer text-gray-500 transition-colors', show && 'text-gray-800')}>
        <HelpCircle className="absolute top-0 w-4" />
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
          className={clsx(
            'absolute -bottom-0 -z-[1] w-[300px] border border-cyan-300 bg-gray-50 p-4 text-sm transition-all max-sm:right-0 max-sm:translate-x-[50%] sm:left-4',
            (show || keep) && 'z-0',
          )}>
          <p className="whitespace-pre-line text-gray-700">{t('helpShortUrlHead')}</p>
        </div>
      </Tooltip>
    </div>
  );
};
