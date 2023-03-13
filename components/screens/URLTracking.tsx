import { Calendar, Copy, Globe, MapPin, UserCheck, UserX } from '@styled-icons/feather';
import { getStats } from 'api/requests';
import { Header } from 'components/layouts/Header';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Stats } from 'pages/api/stats';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { UAParser } from 'ua-parser-js';
import { detectReferer, Referer } from 'utils/agent';
import { getCountryName } from 'utils/country';
import { useTrans } from 'utils/i18next';
import { capitalize, copyToClipBoard } from 'utils/text';

export const URLTracking = ({ record, history, /** SSR then Client fetch */ hash }: Stats & { hash: string }) => {
  const { t } = useTrans();
  const router = useRouter();

  useEffect(() => {
    if (!record && !history && typeof window !== undefined) {
      router.replace('/');
    }
  }, []);

  const { data } = useQuery({
    queryKey: ['forward'],
    queryFn: async () => getStats({ hash }),
    refetchInterval: 2000,
  });

  return (
    <>
      <Header />
      <div className="container mx-auto py-5 px-4">
        {(data?.record || record) && <div>{`Recorded from user: ${record?.ip}`}</div>}
        {(data?.history || history)?.map((h, i) => {
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
                  {h.urlForwardMeta.map((m, j) => {
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
                                className="cursor-pointer text-gray-500 hover:underline"
                                onClick={() => copyToClipBoard(m.userAgent || t('unknown'))}>
                                {t('copyRawInfo')} <Copy className="mb-2 w-3" />
                              </p>
                            </div>
                          ) : (
                            t('unknown')
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                          <Globe className="mr-1 w-4" />
                          {m.ip || t('unknown')}
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
    </>
  );
};
