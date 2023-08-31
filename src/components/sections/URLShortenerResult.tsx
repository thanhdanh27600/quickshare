import { Facebook, Linkedin, Twitter } from '@styled-icons/feather';
import { getQr } from 'api/requests';
import { useBearStore } from 'bear';
import clsx from 'clsx';
import { Button } from 'components/atoms/Button';
import mixpanel from 'mixpanel-browser';
import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { BASE_URL, BASE_URL_SHORT, PLATFORM_AUTH } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { encrypt } from 'utils/crypto';
import { linkWithLanguage, useTrans } from 'utils/i18next';
import { QueryKey, strictRefetch } from 'utils/requests';
import { copyToClipBoard } from 'utils/text';
import { URLAdvancedSetting } from './URLAdvancedSetting';

interface Props {
  setCopied: (s: boolean) => void;
  copied: boolean;
}

export const URLShortenerResult = ({ setCopied, copied }: Props) => {
  const { t, locale } = useTrans('common');
  const { shortenSlice } = useBearStore();
  const getShortenUrl = shortenSlice((state) => state.getShortenUrl);
  const shortenUrl = getShortenUrl();

  const onCopy = () => {
    mixpanel.track(MIXPANEL_EVENT.LINK_COPY, {
      status: MIXPANEL_STATUS.OK,
      shortenUrl,
    });
    setCopied(true);
    copyToClipBoard(shortenUrl);
    toast.success('Copied');
  };
  let token = '';
  if (PLATFORM_AUTH) {
    token = encrypt(shortenUrl.replace(`${BASE_URL_SHORT}/`, ''));
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
      <h2 className="text-xl">🚀 {t('shortenSuccess')}</h2>
      <div className="mt-2 flex justify-between gap-2 border-gray-200 bg-gray-100 px-3 py-6 sm:py-8 md:py-10">
        <a href={linkWithLanguage(shortenUrl, locale)} target="_blank" className="flex-1">
          <p
            className="text-center text-2xl font-bold text-gray-800 transition-all hover:text-cyan-500 hover:underline sm:text-3xl md:text-4xl"
            title={shortenUrl}>
            {linkWithLanguage(shortenUrl, locale).replace(/https:\/\//i, '')}
          </p>
        </a>
        <button
          title="Copy"
          type="button"
          data-copy-state="copy"
          onClick={onCopy}
          className={clsx(
            'flex items-center border-l-2 pl-2 text-sm font-medium text-gray-600 transition-all hover:text-cyan-500 sm:text-lg',
            copied && '!text-cyan-500',
          )}>
          <svg
            className="mr-2 h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>{' '}
          <span className="">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="mt-2 flex w-full justify-end">
        <a
          href={linkWithLanguage(shortenUrl.replace(`${BASE_URL_SHORT}/`, `${BASE_URL}/v/`), locale)}
          target="_blank"
          className="cursor-pointer text-cyan-500 underline decoration-1 transition-all hover:decoration-wavy">
          {t('trackingLive')}
        </a>
      </div>

      <div className="mt-4">
        <URLAdvancedSetting />
      </div>
      <div className="flex justify-center max-sm:mt-4 sm:justify-end">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <a href={`http://www.facebook.com/sharer.php?u=${shortenUrl}`} target="_blank">
            <Button
              text={<Facebook className="h-6 w-6 fill-white" />}
              className="h-fit !bg-[#3b5998] !bg-none hover:!bg-[#4c70ba]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          <a href={`https://twitter.com/share?url=${shortenUrl}`} target="_blank">
            <Button
              text={<Twitter className="h-6 w-6 fill-white" />}
              className="h-fit !bg-[#409dd5] !bg-none hover:!bg-[#6ab2de]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shortenUrl}`} target="_blank">
            <Button
              text={<Linkedin className="h-6 w-6 fill-white" />}
              className="h-fit !bg-[#0077b5] !bg-none hover:!bg-[#007ebf]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          {query.data?.qr && (
            <div className="flex flex-col items-center gap-2">
              <div className="border border-cyan-500 p-1">
                <Image src={query.data?.qr} alt="QR-Code" width={84} height={84} />
              </div>
              <a href={query.data?.qr} download={`QR-${shortenUrl.replace(`${BASE_URL_SHORT}/`, '')}`}>
                <Button
                  text={t('downloadQR')}
                  TextClassname="!text-sm !p-0 text-gray-900"
                  className="!bg-gray-200 !bg-none hover:!bg-gray-300"
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
