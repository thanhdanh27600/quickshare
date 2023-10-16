import clsx from 'clsx';
import { GeoChart } from 'components/atoms/GeoChart';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getStatsGeo } from 'requests';
import { HistoryGeoItem } from 'types/stats';
import { getCountryName } from 'utils/country';
import { useDimensionWindow } from 'utils/dom';
import { useTrans } from 'utils/i18next';
import { QueryKey, strictRefetch } from 'utils/requests';

interface Props {
  hash: string;
  className?: string;
}

export const HistoryGeo = (props: Props) => {
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

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((data) => [getCountryName(data.countryCode || '') || '', data._count.countryCode]);
  }, [data]);

  useEffect(() => {
    setRerender((_) => _ + 1);
  }, [width, locale]);

  if (!fetchStatsGeo.data) return null;

  return (
    <div className={clsx('flex w-full justify-center', props.className)}>
      <GeoChart
        key={rerender}
        label={['Country', t('totalClick')]}
        value={chartData}
        className="h-[200px] w-[400px] sm:h-[300px] sm:w-[600px] lg:h-[500px] lg:w-[900px]"
      />
    </div>
  );
};
