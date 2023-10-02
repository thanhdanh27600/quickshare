import clsx from 'clsx';
import mixpanel from 'mixpanel-browser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useBearStore } from 'store';
import { EVENTS_STATUS, MIXPANEL_EVENT } from 'types/utils';

export const ShortenUrlTile = () => {
  const [copied, setCopied] = useState(false);
  const { shortenSlice } = useBearStore();
  const [shortenUrl] = shortenSlice((state) => [state.getShortenUrl()]);

  const onCopy = () => {
    mixpanel.track(MIXPANEL_EVENT.LINK_COPY, {
      status: EVENTS_STATUS.OK,
      shortenUrl,
    });
    setCopied(true);
    toast.success('Copied');
  };

  return (
    <div className="mt-2 flex flex-wrap justify-between gap-2 border-gray-200 bg-gray-100 px-3 py-6 sm:py-8 md:py-10">
      <a href={shortenUrl} target="_blank" className="flex-1">
        <p
          className="boujee-text break-all text-center text-2xl font-bold tracking-tight transition-all hover:text-cyan-500 hover:underline hover:decoration-wavy sm:text-3xl md:text-4xl"
          title={shortenUrl}>
          {shortenUrl.replace(/https:\/\//i, '')}
        </p>
      </a>
      <button
        title="Copy"
        type="button"
        data-copy-state="copy"
        data-clipboard-text={shortenUrl}
        onClick={onCopy}
        className={clsx(
          'btn-copy flex items-center border-l-2 pl-2 text-sm font-medium text-gray-600 transition-all hover:text-cyan-500 sm:text-lg',
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
  );
};
