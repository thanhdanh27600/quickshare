import { Calendar, Copy, Globe, MapPin, RefreshCw, Search, UserCheck, UserX } from '@styled-icons/feather';
import { JsonViewer } from '@textea/json-viewer';
import { getStats, parseUA } from 'api/requests';
import clsx from 'clsx';
import { Button } from 'components/atoms/Button';
import { Modal } from 'components/atoms/Modal';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { BASE_URL_SHORT, Window } from 'types/constants';
import { UrlHistoryWithMeta } from 'types/stats';
import { MIXPANEL_EVENT } from 'types/utils';
import { UAParser } from 'ua-parser-js';
import { Referer, detectReferer } from 'utils/agent';
import { getCountryName } from 'utils/country';
import date, { DATE_FULL_FORMAT } from 'utils/date';
import { useTrans } from 'utils/i18next';
import { PAGE_SIZE, QueryKey, strictRefetch } from 'utils/requests';
import { capitalize, copyToClipBoard, truncateMiddle } from 'utils/text';
import { SetPassword } from './SetPassword';
import { ValidateToken } from './ValidateToken';

export const URLTracking = ({ hash }: { hash: string }) => {
  const { t, locale } = useTrans();
  const router = useRouter();
  const [needValidate, setNeedValidate] = useState<boolean>();
  const [parsedUA, setParsedUA] = useState();
  const [qc, setQc] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<UrlHistoryWithMeta | undefined>(undefined);
  const getStatsQuery = useCallback(async () => getStats({ hash }), [hash]);
  /* now data has only 1 history */
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: QueryKey.STATS,
    queryFn: getStatsQuery,
    refetchInterval: !!qc || needValidate ? false : 2000,
    retry: false,
    ...strictRefetch,
    onSuccess(data) {
      setHistory(!!data.history?.length ? (data.history[0] as UrlHistoryWithMeta) : undefined);
    },
    onError(err: any) {
      if (err.message === 'UNAUTHORIZED') {
        if (!needValidate) {
          setNeedValidate(true);
        }
      }
    },
  });

  const statsMore = useMutation(QueryKey.STATS_MORE, {
    mutationFn: getStats,
    onSuccess(data) {
      setHistory((h) => {
        if (h) {
          return {
            ...h,
            UrlForwardMeta: [
              ...(h.UrlForwardMeta || []),
              ...(!!data.history?.length ? data.history[0].UrlForwardMeta || [] : []),
            ],
          };
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
  });

  const onLoadMore = () => {
    setQc((_) => {
      const _qc = history?.UrlForwardMeta?.at(-1)?.id;
      if (!statsMore.isLoading) {
        statsMore.mutate({ hash, queryCursor: _qc });
      }
      return _qc;
    });
  };

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

  const hasData = !!history?.UrlForwardMeta?.length;
  const hasPassword = history?.password !== null;
  const hasMore = hasData && (history?.UrlForwardMeta?.length || 0) % PAGE_SIZE === 0;
  const clickableUrl = history ? (history.url.startsWith('http') ? history.url : `//${history.url}`) : '';

  return (
    <LayoutMain>
      <ValidateToken open={needValidate} hash={hash} refetch={refetch} />
      <Modal
        id="parsedUA"
        title={'User Agent'}
        onDismiss={() => setParsedUA(undefined)}
        ConfirmButtonProps={{ ['data-te-modal-dismiss']: true } as any}>
        <div className="contents w-full p-2">{parsedUA && !getMoreUA.isLoading && <JsonViewer value={parsedUA} />}</div>
      </Modal>
      {!needValidate && (
        <div className="mx-auto max-w-7xl py-5 px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {data?.record && <p> {`${t('author')}: ${data?.record.ip}`}</p>}
              {data?.record && (
                <p>
                  {' '}
                  {`${t('shortCreatedAt')}: ${date(data?.record.createdAt).locale(locale).format(DATE_FULL_FORMAT)}`}
                </p>
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
                  <span className="text-cyan-500 underline decoration-1 hover:decoration-wavy">
                    {truncateMiddle(history.url)}
                  </span>
                </a>
              )}
            </div>
            {!hasPassword && <SetPassword hash={hash} />}
          </div>
          <div className={clsx('mt-2 flex items-end justify-between text-sm text-gray-500', !!qc && 'pr-4')}>
            <p className="text-lg capitalize text-cyan-500">
              {`${t('totalClick')}: `}{' '}
              <span className="text-3xl font-bold">{(history as any)?._count?.UrlForwardMeta}</span>
            </p>
            <button
              disabled={!qc}
              className={clsx(qc && 'transition-all hover:text-cyan-500')}
              onClick={() => Window()?.location.reload()}>
              <span className={clsx('text-sm', !!qc ? 'text-red-500 ' : 'animate-ping text-green-500')}>•</span>{' '}
              {!qc && <span className="">{t('autoUpdate')}</span>}
              {!!qc && <span className={clsx(qc && 'hover:underline')}>{t('refresh')}</span>}
              {!!qc && <RefreshCw className="absolute mt-1 ml-1 w-2" />}
            </button>
          </div>

          <div className="relative mt-2 shadow-md">
            <div className="h-[300px] overflow-auto border border-gray-200 sm:rounded-lg lg:h-[400px] 2xl:h-[600px]">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">
                      <span className="">{t('country')}</span>
                    </th>
                    <th className="px-6 py-3">
                      <span className="">{t('userAgent')}</span>
                    </th>
                    <th className="px-6 py-3">
                      <span className="">{`IP`}</span>
                    </th>
                    <th className="px-6 py-3">
                      <span className="">{t('date')}</span>
                    </th>
                    <th className="px-6 py-3 text-right">
                      <span className="float-right block w-32">{t('clickedByHuman')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history?.UrlForwardMeta?.map((m, j) => {
                    const UA = m.userAgent ? new UAParser(m.userAgent) : undefined;
                    const ref = detectReferer(m.userAgent);
                    return (
                      <tr key={`meta-${j}`} className="border-b bg-white">
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                          <MapPin className="mr-1 w-4" />
                          {m.countryCode ? getCountryName(m.countryCode) : t('unknown')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                          {UA ? (
                            <div>
                              <p>
                                Device: {capitalize(UA?.getDevice().type) || t('unknown')} {UA?.getDevice().vendor}{' '}
                                {UA?.getDevice().model}
                              </p>
                              <p>OS: {UA?.getOS().name || t('unknown')}</p>
                              <p>Browser: {UA?.getBrowser().name || t('unknown')}</p>
                              {m.userAgent && (
                                <p
                                  data-te-toggle="modal"
                                  data-te-target="#parsedUA"
                                  className="cursor-pointer text-gray-500 underline hover:text-cyan-500"
                                  onClick={() => {
                                    getMoreUA.mutate(m.userAgent!);
                                  }}>
                                  {t('advancedView')} <Globe className="mb-2 w-3" />
                                </p>
                              )}

                              <p
                                className="cursor-pointer text-gray-500 hover:text-cyan-500 hover:underline"
                                onClick={() => {
                                  copyToClipBoard(m.userAgent || t('unknown'));
                                  toast.success('Copied');
                                }}>
                                {t('copyRawInfo')} <Copy className="mb-2 w-3" />
                              </p>
                            </div>
                          ) : (
                            t('unknown')
                          )}
                        </td>
                        <td className="cursor-pointer whitespace-nowrap px-6 py-4 font-medium text-gray-900 hover:text-cyan-500 hover:underline">
                          <a
                            href={`https://www.ipqualityscore.com/free-ip-lookup-proxy-vpn-test/lookup/${m.ip}`}
                            target="_blank">
                            {m.ip || t('unknown')}
                            <Search className="relative w-3 translate-x-[0.8px] -translate-y-2" />
                          </a>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                          <Calendar className="mr-1 w-4" />
                          {m.updatedAt ? date(m.updatedAt).locale(locale).format(DATE_FULL_FORMAT) : t('unknown')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-gray-900">
                          {m.fromClientSide ? (
                            <UserCheck className="mr-1 w-6 stroke-2 text-green-500" />
                          ) : (
                            <>
                              <UserX className="mr-1 w-6 stroke-2 text-red-500" />
                              {ref !== Referer.UNKNOWN && <p>{ref}</p>}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {hasMore && (
                    <tr>
                      <td colSpan={5}>
                        <div className="flex justify-center py-4">
                          <Button text={t('loadMore')} onClick={onLoadMore} loading={statsMore.isLoading} />
                        </div>
                      </td>
                    </tr>
                  )}
                  {!hasData && (
                    <tr>
                      <td className="h-[200px] text-center text-base" colSpan={5}>
                        {t('noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="m-4">
            <FeedbackLink template={FeedbackTemplate.URL_TRACKING} />
          </div>
        </div>
      )}
    </LayoutMain>
  );
};
