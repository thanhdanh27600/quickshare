import { Calendar, Copy, Globe, MapPin, UserCheck, UserX } from '@styled-icons/feather';
import { Header } from 'components/layouts/Header';
import dayjs from 'dayjs';
import { Stats } from 'pages/api/stats';
import { UAParser } from 'ua-parser-js';
import { useTrans } from 'utils/i18next';
import { copyToClipBoard } from 'utils/text';

export const URLTracking = ({ record, history }: Stats) => {
  const { t } = useTrans();

  return (
    <>
      <Header />
      <div className="container mx-auto py-5">
        <div>{`Recorded from user: ${record?.ip}`}</div>
        {history?.map((h, i) => {
          return (
            <div
              key={`history-${i}`}
              className="relative mt-4 overflow-x-auto border border-gray-200 shadow-md sm:rounded-lg">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Country Code</th>
                    <th className="px-6 py-3">User Agent</th>
                    <th className="px-6 py-3">IP</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Clicked by Human</th>
                  </tr>
                </thead>
                <tbody>
                  {h.urlForwardMeta.map((m, j) => {
                    const UA = m.userAgent ? new UAParser(m.userAgent) : undefined;
                    return (
                      <tr key={`meta-${j}`} className="border-b bg-white">
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                          <MapPin className="mr-1 w-4" />
                          {m.countryCode || t('unknown')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                          {UA ? (
                            <div>
                              <p>
                                Device: {UA?.getDevice().type || t('unknown')} {UA?.getDevice().vendor}
                              </p>
                              <p>OS: {UA?.getOS().name}</p>
                              <p>Browser: {UA?.getBrowser().name}</p>
                              <p
                                className="cursor-pointer hover:underline"
                                onClick={() => copyToClipBoard(m.userAgent || t('unknown'))}>
                                copy raw info <Copy className="mb-2 w-3" />
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
                            <UserX className="mr-1 w-6 stroke-2 text-red-500" />
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
