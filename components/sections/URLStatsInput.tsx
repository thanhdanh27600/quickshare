import { getStats } from 'api/requests';
import clsx from 'clsx';
import { Accordion } from 'components/atoms/Accordion';
import { Dropdown } from 'components/atoms/Dropdown';
import { InputWithButton } from 'components/atoms/Input';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { BASE_URL, BASE_URL_SHORT, LIMIT_RECENT_HISTORY } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { linkWithLanguage, useTrans } from 'utils/i18next';
import { QueryKey, strictRefetch } from 'utils/requests';
import { FeedbackLink, FeedbackTemplate } from './FeedbackLink';
type URLStatsForm = {
  hash: string;
};

export const URLStats = () => {
  const { t, locale } = useTrans();

  const onSubmit: SubmitHandler<URLStatsForm> = ({ hash: h }) => {
    const hash = h.startsWith(BASE_URL_SHORT.replace(`${location.protocol}//`, '')) ? `${location.protocol}//` + h : h;
    fetchTracking.mutate({ hash: hash.replace(BASE_URL_SHORT + '/', '') });
  };

  const fetchTracking = useMutation(QueryKey.STATS, getStats);
  const fetchRecord = useQuery({
    queryKey: QueryKey.RECORD,
    queryFn: async () => getStats({ hash: '' }),
    refetchInterval: -1,
    ...strictRefetch,
  });
  const recentHistories = fetchRecord.data?.history;
  const hasHistory = recentHistories?.length || 0 > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm<URLStatsForm>({
    defaultValues: { hash: hasHistory ? `${BASE_URL_SHORT}/${fetchRecord.data?.history![0].hash}` : '' },
  });

  const error = errors.hash?.message; /** form error */

  useEffect(() => {
    if (!fetchTracking.isSuccess && (fetchTracking.error as any)?.message !== 'UNAUTHORIZED') return;
    if (!fetchTracking.data?.history && (fetchTracking.error as any)?.message !== 'UNAUTHORIZED') {
      setError('hash', {
        message: t('errorNoTracking'),
      });
    } else {
      const h = getValues('hash');
      const hash = h.startsWith(BASE_URL_SHORT.replace(`${location.protocol}//`, ''))
        ? `${location.protocol}//` + h
        : h;
      location.href = linkWithLanguage(`${BASE_URL}/v/${hash.replace(BASE_URL_SHORT + '/', '')}`, locale);
    }
  }, [fetchTracking.isSuccess, fetchTracking.isError]);

  const title = [
    <span className="relative" key="accordion-viewmore">
      {t('viewMore')}
      {hasHistory && (
        <span className="absolute bottom-2 -right-7 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm">
          {recentHistories?.length}
          {Number(recentHistories?.length) >= LIMIT_RECENT_HISTORY && '+'}
        </span>
      )}
    </span>,
  ];

  return (
    <Accordion title={title}>
      <div className="solid rounded-lg border p-4 py-8 shadow-card sm:px-8 sm:py-8 sm:pt-10">
        <h1 className="mb-4 text-4xl">{t('tracking')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <InputWithButton
            placeholder={`${BASE_URL_SHORT}/xxx`}
            Prefix={
              hasHistory ? (
                <Dropdown
                  ContainerProps={{ className: 'absolute h-55 w-fit text-sm' }}
                  options={(fetchRecord.data?.history || []).map((h, idx) => ({
                    label: `${idx + 1}. ${h.url} (${h.hash})`,
                    value: `${BASE_URL_SHORT}/${h.hash}`,
                  }))}
                  handleSelect={(value) => {
                    setValue('hash', value);
                  }}
                />
              ) : undefined
            }
            {...register('hash', {
              required: { message: t('errorNoInput'), value: true },
              validate: function (values) {
                const v = values.startsWith(BASE_URL_SHORT.replace(`${location.protocol}//`, ''))
                  ? `${location.protocol}//` + values
                  : values;
                return v.startsWith(BASE_URL_SHORT) && /^.{3}$/.test(v.replace(BASE_URL_SHORT + '/', ''))
                  ? undefined
                  : t('errorInvalidForward', { name: `${BASE_URL_SHORT}/xxx` });
              },
            })}
            buttonProps={{
              text: t('continue'),
              variant: 'filled',
              type: 'submit',
              className: 'bg-gray-500 bg-none',
              TextClassname: 'text-sm sm:text-xl',
            }}
            className={clsx(hasHistory ? 'pl-16' : 'pl-4')}
            onFocus={() => {
              mixpanel.track(MIXPANEL_EVENT.INPUT_STATS, { status: MIXPANEL_STATUS.OK });
            }}
          />
        </form>
        <p className="mt-4 text-red-400">{error}</p>
        <FeedbackLink template={FeedbackTemplate.URL_TRACKING} />
      </div>
    </Accordion>
  );
};
