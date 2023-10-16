import clsx from 'clsx';
import { BarChart } from 'components/atoms/BarChart';
import { GeoChart } from 'components/atoms/GeoChart';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getStatsGeo } from 'requests';
import { HistoryGeoItem } from 'types/stats';
import { getCountryName } from 'utils/country';
import { useDimensionWindow } from 'utils/dom';
import { useTrans } from 'utils/i18next';
import { parseIntSafe } from 'utils/number';
import { QueryKey, strictRefetch } from 'utils/requests';

const color = '#7354e5';

interface Props {
  hash: string;
  className?: string;
}

export const HistoryByCountry = (props: Props) => {
  const { hash } = props;
  const { t, locale } = useTrans();
  const [rerender, setRerender] = useState(0);
  const { width } = useDimensionWindow();
  const fetchStatsGeo = useQuery({
    queryKey: QueryKey.STATS_GEO,
    queryFn: async () => getStatsGeo({ hash }),
    ...strictRefetch,
    onSuccess(data) {
      if (data.history) setData(data.history);
    },
    onError(error) {
      console.error(error);
      toast.error(t('errorNoTracking'));
    },
  });

  const [data, setData] = useState<HistoryGeoItem[]>(fetchStatsGeo.data?.history || []);

  const chartDataGeo = useMemo(() => {
    if (!data) return [];
    return data.map((data) => [getCountryName(data.countryCode || '') || '', data._count.countryCode]);
  }, [data]);
  const chartDataBar = useMemo(() => {
    if (!data) return [];
    let total = data.map((data) => [
      getCountryName(data.countryCode || '') || '',
      data._count.countryCode,
      `color: ${color}`,
    ]);
    if (total.length > 3) {
      const others = total.slice(3);
      total = [
        ...total.slice(0, 3),
        others.reduce((prev, cur) => [
          t('otherCountry'),
          parseIntSafe(prev[1]) + parseIntSafe(cur[1]),
          `color: ${color}`,
        ]),
      ];
    }
    return total;
  }, [data]);

  useEffect(() => {
    setRerender((_) => _ + 1);
  }, [width, locale]);

  if (!fetchStatsGeo.data) return null;

  return (
    <div className={clsx('flex h-full w-full flex-col items-center justify-center gap-4 lg:flex-row', props.className)}>
      <GeoChart
        key={`geo-${rerender}`}
        label={['Country', t('totalClick')]}
        value={chartDataGeo}
        className="h-[240px] w-full sm:w-[400px] lg:h-[300px] lg:w-[500px]"
      />
      <BarChart
        key={`bar-${rerender}`}
        label={['Country', t('totalClick'), { role: 'style' }]}
        value={chartDataBar}
        className="w-full sm:w-[400px] md:w-[600px]"
      />
    </div>
  );
};
