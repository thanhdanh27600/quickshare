import { getQr } from 'api/requests';
import clsx from 'clsx';
import { Button } from 'components/atoms/Button';
import CryptoJS from 'crypto-js';
import mixpanel from 'mixpanel-browser';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { BASE_URL, PLATFORM_AUTH } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { copyToClipBoard } from 'utils/text';

interface Props {
  setCopied: (s: boolean) => void;
  copied: boolean;
  shortenedUrl: string;
}

export const URLShortenerResult = ({ setCopied, copied, shortenedUrl }: Props) => {
  const { t } = useTrans('common');
  const onCopy = () => {
    mixpanel.track(MIXPANEL_EVENT.LINK_COPY, {
      status: MIXPANEL_STATUS.OK,
    });
    setCopied(true);
    copyToClipBoard(shortenedUrl);
  };
  let token = '';
  if (PLATFORM_AUTH) {
    token = CryptoJS.AES.encrypt(shortenedUrl.replace(`${BASE_URL}/`, ''), PLATFORM_AUTH).toString();
  } else {
    console.error('Not found PLATFORM_AUTH');
  }

  const query = useQuery({
    queryKey: ['qr'],
    queryFn: async () => getQr(shortenedUrl, token),
  });

  return (
    <div className="mt-4">
      <h3>{t('shortenSuccess')}</h3>
      <div className="mt-2 flex flex-wrap justify-between border-gray-200 bg-gray-100 px-3 py-10">
        <a href={shortenedUrl} target="_blank">
          <p
            className="text-lg font-bold transition-all hover:text-cyan-500 hover:underline sm:text-3xl"
            title={shortenedUrl}>
            {shortenedUrl}
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
      <div className="mt-4 flex flex-col flex-wrap justify-between gap-8 sm:flex-row sm:items-center">
        <a
          href={shortenedUrl.replace(`${BASE_URL}/`, `${BASE_URL}/v/`)}
          target="_blank"
          className="cursor-pointer text-cyan-500 underline decoration-1 transition-all hover:decoration-wavy">
          {t('trackingLive')}
        </a>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <a href={`http://www.facebook.com/sharer.php?u=${shortenedUrl}`} target="_blank">
            <Button
              text={t('shareFacebook')}
              className="h-fit !bg-[#3b5998] !bg-none hover:!bg-[#4c70ba]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          <a href={`https://twitter.com/share?url=${shortenedUrl}`} target="_blank">
            <Button
              text={t('shareTwitter')}
              className="h-fit !bg-[#409dd5] !bg-none hover:!bg-[#6ab2de]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shortenedUrl}`} target="_blank">
            <Button
              text={t('shareLinkedIn')}
              className="h-fit !bg-[#0077b5] !bg-none hover:!bg-[#007ebf]"
              TextClassname="!text-sm !p-0"
            />
          </a>
          {query.data?.qr && (
            <div className="mt-1 flex flex-col items-center gap-2">
              <Image src={query.data?.qr} alt="QR-Code" width={84} height={84} />
              <a href={query.data?.qr} download={`QR-${shortenedUrl.replace(`${BASE_URL}/`, '')}`}>
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
