import { useBearStore } from 'bear';
import clsx from 'clsx';
import mixpanel from 'mixpanel-browser';
import { isEmpty } from 'ramda';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EVENTS_STATUS, MIXPANEL_EVENT } from 'types/utils';
import { useTrans } from 'utils/i18next';

export const NoteUrlTile = () => {
  const { t } = useTrans();
  const { noteSlice, shortenSlice } = useBearStore();
  const [note, getEditUrl] = noteSlice((state) => [state.note, state.getEditUrl]);
  const [shortenUrl, trackingUrl] = shortenSlice((state) => [state.getShortenUrl(), state.getTrackingUrl()]);
  const editUrl = getEditUrl();
  const [copied, setCopied] = useState<any>({
    short: false,
    tracking: false,
    edit: false,
  });

  const onCopy = (type: 'short' | 'tracking' | 'edit') => () => {
    mixpanel.track(MIXPANEL_EVENT.LINK_COPY, {
      status: EVENTS_STATUS.OK,
      type,
      note,
    });
    setCopied({ [type]: true });
    toast.success('Copied');
  };

  useEffect(() => {
    if (isEmpty(copied)) return;
    let timeout = setTimeout(() => {
      setCopied({} as any);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  if (!note) return null;

  return (
    <div className="mb-4">
      <p>🚀 {t('noteSuccess')}</p>
      <div className="my-4 flex flex-wrap justify-between gap-2 border-gray-200 bg-gray-100 px-3 py-6">
        <a href={shortenUrl} target="_blank" className="flex-1">
          <p
            className="boujee-text text-center text-xl font-bold tracking-tight transition-all hover:text-cyan-500 hover:underline md:text-2xl"
            title={shortenUrl}>
            {shortenUrl.replace(/https:\/\//i, '')}
          </p>
        </a>
        <button
          title="Copy"
          type="button"
          data-copy-state="copy"
          data-clipboard-text={shortenUrl}
          onClick={onCopy('short')}
          className={clsx(
            'btn-copy flex items-center border-l-2 pl-2 text-sm font-medium text-gray-600 transition-all hover:text-cyan-500',
            !!copied.short && '!text-cyan-500',
          )}>
          <svg
            className="mr-2 h-4 w-4"
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
          <span className="max-sm:hidden">{!!copied.short ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="text-sm">{t('tracking')}</div>
      <div className="flex flex-wrap justify-start gap-2">
        <a href={trackingUrl} target="_blank">
          <p className="text-sm tracking-tight text-cyan-500 transition-all hover:underline" title={trackingUrl}>
            {trackingUrl.replace(/https:\/\//i, '')}
          </p>
        </a>
        <button
          title="Copy"
          type="button"
          data-copy-state="copy"
          data-clipboard-text={trackingUrl}
          onClick={onCopy('tracking')}
          className={clsx(
            'btn-copy flex items-center border-l-2 pl-2 text-sm font-medium text-gray-600 transition-all hover:text-cyan-500',
            !!copied.tracking && '!text-cyan-500',
          )}>
          <svg
            className="mr-2 h-4 w-4"
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
          <span className="max-sm:hidden">{!!copied.tracking ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="mt-2 text-sm">{t('edit')}</div>
      <div className="flex flex-wrap justify-start gap-2">
        <a href={editUrl} target="_blank">
          <p className="text-sm tracking-tight text-cyan-500 transition-all hover:underline" title={editUrl}>
            {editUrl.replace(/https:\/\//i, '')}
          </p>
        </a>
        <button
          title="Copy"
          type="button"
          data-copy-state="copy"
          data-clipboard-text={editUrl}
          onClick={onCopy('edit')}
          className={clsx(
            'btn-copy flex items-center border-l-2 pl-2 text-sm font-medium text-gray-600 transition-all hover:text-cyan-500',
            !!copied.edit && '!text-cyan-500',
          )}>
          <svg
            className="mr-2 h-4 w-4"
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
          <span className="max-sm:hidden">{!!copied.edit ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
