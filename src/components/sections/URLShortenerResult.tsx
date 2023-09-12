import { Facebook, Share2, Twitter } from '@styled-icons/feather';
import { getQr } from 'api/requests';
import { useBearStore } from 'bear';
import { Button } from 'components/atoms/Button';
import { ShortenUrlTile } from 'components/gadgets/ShortenUrlTile';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { BASE_URL, BASE_URL_SHORT, PLATFORM_AUTH } from 'types/constants';
import { encrypt } from 'utils/crypto';
import { linkWithLanguage, useTrans } from 'utils/i18next';
import { QueryKey, strictRefetch } from 'utils/requests';
import { share } from 'utils/text';
import { URLAdvancedSetting } from './URLAdvancedSetting';

export const URLShortenerResult = () => {
  const { t, locale } = useTrans('common');
  const [copied, setCopied] = useState(false);
  const { shortenSlice } = useBearStore();
  const [getShortenUrl, getHash] = shortenSlice((state) => [state.getShortenUrl, state.getHash]);
  const shortenUrl = getShortenUrl();

  const onShare = () => {
    share(
      {
        title: t('ogTitle', { hash: getHash() }),
        text: t('ogDescription'),
        url: shortenUrl,
      },
      t,
    );
  };

  let token = '';
  if (PLATFORM_AUTH) {
    token = encrypt(getHash());
  } else {
    console.error('Not found PLATFORM_AUTH');
  }

  const query = useQuery({
    queryKey: QueryKey.QR,
    queryFn: async () => getQr(shortenUrl, token),
    ...strictRefetch,
  });

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
      <h2 className="text-lg">🚀 {t('shortenSuccess')}</h2>
      <ShortenUrlTile shortenUrl={shortenUrl} />
      <div className="mt-2 flex w-full justify-end">
        <a
          href={linkWithLanguage(shortenUrl.replace(`${BASE_URL_SHORT}/`, `${BASE_URL}/v/`), locale)}
          target="_blank"
          className="cursor-pointer text-cyan-500 underline decoration-1 transition-all hover:decoration-wavy">
          {t('trackingLive')}
        </a>
      </div>
      <div className="mt-4 flex justify-center sm:justify-end">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            text={<Share2 className="h-6 w-6 fill-white" />}
            className="h-fit !bg-gray-400 !bg-none hover:!bg-gray-400/80"
            TextClassname="!text-sm !p-0"
            onClick={onShare}
          />
          <a href={`http://www.facebook.com/sharer.php?u=${shortenUrl}`} target="_blank">
            <Button
              text={<Facebook className="h-6 w-6 fill-white" />}
              className="h-fit !bg-[#3b5998] !bg-none hover:!bg-[#4c70ba]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${t('ogTitle', { hash: getHash() })}&url=${shortenUrl}`}
            target="_blank">
            <Button
              text={<Twitter className="h-6 w-6 fill-white" />}
              className="h-fit !bg-[#409dd5] !bg-none hover:!bg-[#6ab2de]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          {query.data?.qr && (
            <a
              href={query.data?.qr}
              download={`QR-${shortenUrl.replace(`${BASE_URL_SHORT}/`, '')}`}
              className="flex flex-col items-center gap-2">
              <div className="border border-cyan-500 p-1">
                <Image src={query.data?.qr} alt="QR-Code" width={84} height={84} />
              </div>
              <Button
                text={t('downloadQR')}
                TextClassname="!text-sm !p-0 text-gray-900"
                className="!bg-gray-200 !bg-none hover:!bg-gray-300"
              />
            </a>
          )}
        </div>
      </div>
      <URLAdvancedSetting />
    </div>
  );
};
