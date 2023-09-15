import { useBearStore } from 'bear';
import { ShortenUrlTile } from 'components/gadgets/ShortenUrlTile';
import { useEffect, useState } from 'react';
import { BASE_URL, BASE_URL_SHORT } from 'types/constants';
import { linkWithLanguage, useTrans } from 'utils/i18next';
import { URLShare } from '../gadgets/URLShare';
import { URLAdvancedSetting } from './URLAdvancedSetting';

export const URLShortenerResult = () => {
  const { t, locale } = useTrans('common');
  const [copied, setCopied] = useState(false);
  const { shortenSlice } = useBearStore();
  const [shortenUrl] = shortenSlice((state) => [state.getShortenUrl()]);

  useEffect(() => {
    if (!copied) return;
    let timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div className="mt-4">
      <p>🚀 {t('shortenSuccess')}</p>
      <ShortenUrlTile />
      <div className="mt-2 flex w-full justify-end">
        <a
          href={linkWithLanguage(shortenUrl.replace(`${BASE_URL_SHORT}/`, `${BASE_URL}/v/`), locale)}
          target="_blank"
          className="cursor-pointer text-cyan-500 underline decoration-1 transition-all hover:decoration-wavy">
          {t('trackingLive')}
        </a>
      </div>
      <URLShare />
      <URLAdvancedSetting />
    </div>
  );
};
