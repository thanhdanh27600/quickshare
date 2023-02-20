import clsx from 'clsx';
import mixpanel from 'mixpanel-browser';
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

  return (
    <div className="mt-4">
      <h3>{t('shortenSuccess')}</h3>
      <div className="mt-2 flex flex-wrap justify-between border-gray-200 bg-gray-100 px-3 py-10">
        <a href={shortenedUrl} target="_blank">
          <p
            className="text-lg font-bold transition-all hover:text-cyan-500 hover:underline sm:text-2xl"
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
    </div>
  );
};
