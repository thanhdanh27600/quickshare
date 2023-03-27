import { UrlForwardMeta, UrlShortenerHistory } from '@prisma/client';
import { Calendar, Copy, MapPin, RefreshCw, Search, UserCheck, UserX } from '@styled-icons/feather';
import { getStats } from 'api/requests';
import clsx from 'clsx';
import { Button } from 'components/atoms/Button';
import { LayoutMain } from 'components/layouts/LayoutMain';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from 'react-query';
import { brandUrl, isShortDomain, PLATFORM_AUTH, Window } from 'types/constants';
import { MIXPANEL_EVENT } from 'types/utils';
import { UAParser } from 'ua-parser-js';
import { detectReferer, Referer } from 'utils/agent';
import { getCountryName } from 'utils/country';
import { useTrans } from 'utils/i18next';
import { PAGE_SIZE, strictRefetch } from 'utils/requests';
import { capitalize, copyToClipBoard, truncate } from 'utils/text';
import { SetPassword } from './SetPassword';
import { ValidateToken } from './ValidateToken';

export const URLTracking = ({ /**  record, history, SSR then Client fetch */ hash }: { hash: string }) => {
  const { t } = useTrans();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [qc, setQc] = useState<number | undefined>(undefined);
  const [history, setHistory] = useState<(UrlShortenerHistory & { urlForwardMeta: UrlForwardMeta[] }) | undefined>(
    undefined,
  );

  if (isShortDomain) {
    Window()?.location.replace(brandUrl);
  }

  /* now data has only 1 history */
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['forward'],
    queryFn: async () => getStats({ hash }),
    refetchInterval: !!qc ? false : 2000,
    ...strictRefetch,
    onSuccess(data) {
      setHistory(
        !!data.history?.length
          ? (data.history[0] as UrlShortenerHistory & { urlForwardMeta: UrlForwardMeta[] })
          : undefined,
      );
    },
  });

  const forwardMore = useMutation('forwardMore', {
    mutationFn: getStats,
    onSuccess(data) {
      setHistory((h) => {
        if (h) {
          return {
            ...h,
            urlForwardMeta: [...h.urlForwardMeta, ...(!!data.history?.length ? data.history[0].urlForwardMeta! : [])],
          };
        }
      });
    },
  });

  const onLoadMore = () => {
    setQc((_) => {
      const _qc = history?.urlForwardMeta?.at(-1)?.id;
      if (!forwardMore.isLoading) forwardMore.mutate({ hash, queryCursor: _qc });
      return _qc;
    });
  };

  useEffect(() => {
    if (isSuccess) {
      if (!data?.record && !data?.history) router.replace('/');
    }
  }, [isSuccess]);

  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.TRACKING);
  }, []);

  if (isLoading) return null;

  const password = (data?.history || [])[0]?.password;

  const needValidate = !!password && open;

  const onInputPassword = (_password: string, setError?: any) => {
    let decryptPassword = '';
    if (PLATFORM_AUTH && password) {
      const bytes = CryptoJS.AES.decrypt(password, PLATFORM_AUTH);
      decryptPassword = bytes.toString(CryptoJS.enc.Utf8);
    }
    if (decryptPassword !== _password && setError) {
      setError('password', {
        message: t('errorInvalidInput'),
      });
    } else {
      setOpen(false);
    }
  };

  const hasData = !!history?.urlForwardMeta?.length;
  const hasMore = hasData && (history?.urlForwardMeta?.length || 0) % PAGE_SIZE === 0;

  return (
    <LayoutMain>
      <ValidateToken setToken={onInputPassword} open={needValidate} />
      {!needValidate && (
        <div className="mx-auto max-w-7xl py-5 px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {data?.record && <span> {`${t('author')}: ${data?.record.ip}`}</span>}
              {history?.url && (
                <a className="block" href={history.url} target="_blank" title={history.url}>
                  URL:{' '}
                  <span className="text-cyan-500 underline decoration-1 hover:decoration-wavy">
                    {truncate(history.url)}
                  </span>
                </a>
              )}
            </div>
            {!password && <SetPassword hash={hash} setToken={onInputPassword} />}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <span className={clsx(!!qc ? 'text-red-500' : 'text-green-500')}>•</span> <span>{t('autoUpdate')}</span>
            <RefreshCw className="absolute mt-1 ml-1 w-2" />
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
                      <span className="float-right block w-32">
                        {t('clickedByHuman')} ({(history as any)._count?.urlForwardMeta})
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history?.urlForwardMeta?.map((m, j) => {
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
                          {m.updatedAt ? dayjs(m.updatedAt).format('MMMM DD YYYY, HH:mm:ss') : t('unknown')}
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
                          <Button text="Load more" onClick={onLoadMore} loading={forwardMore.isLoading} />
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
