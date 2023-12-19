import { RefreshCw } from '@styled-icons/feather';
import { Modal } from 'components/atoms/Modal';
import { Tab, Tabs } from 'components/atoms/Tabs';
import mixpanel from 'mixpanel-browser';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getStats, parseUA } from 'requests';
import { useBearStore } from 'store';
import { BASE_URL_SHORT, Window } from 'types/constants';
import { UrlHistoryWithMeta } from 'types/stats';
import { MIXPANEL_EVENT } from 'types/utils';
import date, { DATE_FULL_FORMAT } from 'utils/date';
import { useTrans } from 'utils/i18next';
import { QueryKey, strictRefetch } from 'utils/requests';
import { truncateMiddle } from 'utils/text';
import { HistoryByCountry } from './HistoryByCountry';
import { HistoryTable } from './HistoryTable';
import { SetPassword } from './SetPassword';
import { ValidatePassword } from './ValidatePassword';

const tabs = (t: any): Tab[] => [
  { content: t('clicks'), key: 'table' },
  { content: t('clicksByCountry'), key: 'geo' },
];
const JsonViewer = dynamic(() => import('@textea/json-viewer').then((c) => c.JsonViewer));

export const TrackingClick = ({ hash }: { hash: string }) => {
  const { t, locale } = useTrans();
  const router = useRouter();
  const [tab, setTab] = useState<string>('table');
  const [needValidate, setNeedValidate] = useState<boolean>();
  const [parsedUA, setParsedUA] = useState();
  const [noBot, setNoBot] = useState(false);
  const [history, setHistory] = useState<UrlHistoryWithMeta | undefined>(undefined);
  const getStatsQuery = useCallback(async () => getStats({ hash, noBot }), [hash, noBot]);
  const { shortenSlice } = useBearStore();
  const [shortenHistory, setShortenHistory, clearShortenHistory] = shortenSlice((state) => [
    state.shortenHistory,
    state.setShortenHistory,
    state.clearShortenHistory,
  ]);
  const { current: lastUpdate } = useRef(date().locale(locale).format('LT'));

  /* now data has only 1 history */
  const { data, isLoading, refetch, isSuccess } = useQuery({
    queryKey: QueryKey.STATS,
    queryFn: getStatsQuery,
    retry: false,
    ...strictRefetch,
    onSuccess(data) {
      if (!!data.history?.length) {
        setHistory(data.history[0] as UrlHistoryWithMeta);
        if (!shortenHistory) setShortenHistory(data.history[0]);
      }
    },
    onError(err: any) {
      if (err.message === 'UNAUTHORIZED') {
        if (!needValidate) {
          setNeedValidate(true);
        }
        clearShortenHistory();
      }
    },
  });

  const statsMore = useMutation(QueryKey.STATS_MORE, {
    mutationFn: getStats,
    onSuccess(data) {
      setHistory((h) => {
        if (h) {
          const history = {
            ...h,
            UrlForwardMeta: [
              ...(h.UrlForwardMeta || []),
              ...(!!data.history?.length ? data.history[0].UrlForwardMeta || [] : []),
            ],
          };
          return history;
        }
        return undefined;
      });
    },
  });

  const getMoreUA = useMutation(QueryKey.PARSE_UA, {
    mutationFn: parseUA,
    onSuccess(data) {
      setParsedUA(data);
    },
    onMutate(data) {
      setParsedUA({ userAgent: data } as any);
    },
  });

  useEffect(() => {
    if (isSuccess && !data?.record && !data?.history) {
      router.replace('/');
    }
  }, [isSuccess]);

  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.TRACKING);
  }, []);

  if (isLoading) {
    return null;
  }

  const hasPassword = history?.password !== null;
  const clickableUrl = history ? (history.url.startsWith('http') ? history.url : `//${history.url}`) : '';

  return (
    <div>
      <ValidatePassword open={needValidate} hash={hash} />
      <Modal
        id="parsedUA"
        title={'User Agent'}
        onDismiss={() => setParsedUA(undefined)}
        ConfirmButtonProps={{ ['data-te-modal-dismiss']: true } as any}>
        <div className="contents w-full p-2">
          {parsedUA ? !getMoreUA.isLoading && <JsonViewer rootName="data" value={parsedUA} /> : ''}
        </div>
      </Modal>
      {!needValidate && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {data?.record && <p> {`${t('author')}: ${data?.record.ip}`}</p>}
              {data?.record && (
                <p>{`${t('shortCreatedAt')}: ${date(history?.createdAt).locale(locale).format(DATE_FULL_FORMAT)}`}</p>
              )}
              {history?.hash && (
                <a
                  className="block"
                  href={`${BASE_URL_SHORT}/${history.hash}`}
                  target="_blank"
                  title={`${BASE_URL_SHORT}/${history.hash}`}>
                  {t('shortenedURL')}:{' '}
                  <span className="text-cyan-500 underline decoration-1 hover:decoration-wavy">
                    {`${BASE_URL_SHORT}/${history.hash}`.replace(`${location.protocol}//`, '')}
                  </span>
                </a>
              )}
              {history?.url && (
                <a className="block" href={clickableUrl} target="_blank" title={history.url}>
                  URL:{' '}
                  <span className="text-cyan-500  underline decoration-1 hover:decoration-wavy">
                    {truncateMiddle(history.url)}
                  </span>
                </a>
              )}
            </div>
            {!hasPassword && <SetPassword hash={hash} email={shortenHistory?.email} />}
          </div>
          <p className="mt-2 text-lg capitalize text-cyan-500">
            {`${t('totalClick')}: `}{' '}
            <span className="text-3xl font-bold">{(history as any)?._count?.UrlForwardMeta}</span>
          </p>
          <div
            className={
              'my-2 flex flex-col items-start justify-between gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:pr-4'
            }>
            <Tabs className="border-none" tabs={tabs(t)} selectedKey={tab} setSelectedKey={setTab} />
            {tab === 'table' && (
              <button className={'transition-all hover:text-cyan-500'} onClick={() => Window()?.location.reload()}>
                <span className={'text-sm text-cyan-500'}>•</span>{' '}
                <span className={'hover:underline'}>{t('lastUpdate') + ' ' + lastUpdate}</span>
                <RefreshCw className="absolute ml-1 mt-1 w-3" />
              </button>
            )}
          </div>
          <div className="my-2">
            {tab === 'geo' && <HistoryByCountry className="my-8" hash={hash} />}
            {tab === 'table' && (
              <HistoryTable
                refetch={refetch}
                noBot={noBot}
                setNoBot={setNoBot}
                history={history}
                statsMore={statsMore}
                getMoreUA={getMoreUA}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
