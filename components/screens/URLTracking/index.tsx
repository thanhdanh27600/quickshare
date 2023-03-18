import { Calendar, Copy, MapPin, RefreshCw, Search, UserCheck, UserX } from '@styled-icons/feather';
import { getStats } from 'api/requests';
import { Header } from 'components/layouts/Header';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { PLATFORM_AUTH } from 'types/constants';
import { UAParser } from 'ua-parser-js';
import { detectReferer, Referer } from 'utils/agent';
import { getCountryName } from 'utils/country';
import { useTrans } from 'utils/i18next';
import { capitalize, copyToClipBoard } from 'utils/text';
import { SetPassword } from './SetPassword';
import { ValidateToken } from './ValidateToken';

export const URLTracking = ({ /**  record, history, SSR then Client fetch */ hash }: { hash: string }) => {
  const { t } = useTrans();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  /* now data has only 1 history */
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['forward'],
    queryFn: async () => getStats({ hash }),
    refetchInterval: 2000,
  });

  useEffect(() => {
    if (isSuccess) {
      if (!data?.record && !data?.history) router.replace('/');
    }
  }, [isSuccess]);

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

  return (
    <>
      <Header />
      <ValidateToken setToken={onInputPassword} open={needValidate} />
      {!needValidate && (
        <div className="container mx-auto py-5 px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {data?.record && <span> {`${t('author')}: ${data?.record.ip}`}</span>}
            <div className="flex items-center gap-4">
              <span className="mr-4 text-sm text-gray-500">
                <span className="text-green-500">•</span> <span>{t('autoUpdate')}</span>
                <RefreshCw className="absolute mt-1 ml-1 w-2" />
              </span>
              {!password && <SetPassword hash={hash} setToken={onInputPassword} />}
            </div>
          </div>
          {data?.history?.map((h, i) => {
            return (
              <div
                key={`history-${i}`}
                className="relative mt-4 overflow-x-auto border border-gray-200 shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="px-6 py-3">{t('countryCode')}</th>
                      <th className="px-6 py-3">{t('userAgent')}</th>
                      <th className="px-6 py-3">{`IP`}</th>
                      <th className="px-6 py-3">{t('date')}</th>
                      <th className="px-6 py-3 text-right">{t('clickedByHuman')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.urlForwardMeta?.map((m, j) => {
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
                              <Search className="absolute w-4 -translate-y-2" />
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
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};