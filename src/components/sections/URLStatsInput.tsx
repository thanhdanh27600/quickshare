import clsx from 'clsx';
import { Accordion } from 'components/atoms/Accordion';
import { Dropdown } from 'components/atoms/Dropdown';
import { InputWithButton } from 'components/atoms/Input';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { getStats } from 'requests';
import { BASE_URL, BASE_URL_SHORT, HASH_CUSTOM, LIMIT_RECENT_HISTORY } from 'types/constants';
import { UrlHistoryWithMeta } from 'types/stats';
import { EVENTS_STATUS, MIXPANEL_EVENT } from 'types/utils';
import { linkWithLanguage, useTrans } from 'utils/i18next';
import { QueryKey, strictRefetch } from 'utils/requests';
import { truncateMiddle } from 'utils/text';
import { FeedbackLink, FeedbackTemplate } from './FeedbackLink';

type URLStatsForm = {
  hash: string;
};

export const URLStats = ({ defaultOpen = false }: { defaultOpen?: boolean }) => {
  const { t, locale } = useTrans();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm<URLStatsForm>();

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
    onSuccess(data) {
      setValue('hash', data?.record?.history?.at(0) ? `${BASE_URL_SHORT}/${data?.record?.history[0].hash}` : '');
    },
  });
  const recentHistories = fetchRecord.data?.record?.history;
  const hasHistory = (recentHistories?.length || 0) > 0;

  const error = errors.hash?.message; /** form error */

  useEffect(() => {
    if (!fetchTracking.isSuccess && (fetchTracking.error as any)?.message !== 'UNAUTHORIZED') {
      return;
    }
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

  const title = (
    <span className="relative">
      {t('manageLink')}
      {hasHistory && (
        <span className="absolute -right-7 bottom-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm">
          {recentHistories?.length}
          {Number(recentHistories?.length) >= LIMIT_RECENT_HISTORY && '+'}
        </span>
      )}
    </span>
  );

  return (
    <Accordion title={title} defaultOpen={defaultOpen}>
      <div className="solid container mx-auto max-w-5xl rounded-lg border p-4 py-8 shadow-xl sm:px-8 sm:py-8 sm:pt-10">
        <h1 className="mb-4 text-3xl">{t('findLink')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <InputWithButton
            placeholder={`${BASE_URL_SHORT}/xxx`}
            Prefix={
              hasHistory ? (
                <Dropdown
                  buttonClassName="rounded-l-lg"
                  ContainerProps={{ className: 'absolute h-55 w-fit text-sm' }}
                  options={(fetchRecord.data?.history || []).map((h: UrlHistoryWithMeta, idx) => ({
                    label: `${idx + 1}. ${truncateMiddle(h.url)} (${h.hash})`,
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
                return v.startsWith(BASE_URL_SHORT) && HASH_CUSTOM.Regex.test(v.replace(BASE_URL_SHORT + '/', ''))
                  ? undefined
                  : t('errorInvalidForward', { name: `${BASE_URL_SHORT}/xxx` });
              },
              deps: [],
            })}
            buttonProps={{
              text: t('continue'),
              variant: 'filled',
              type: 'submit',
              className: 'bg-gray-500 bg-none hover:bg-gray-500/80 disabled:bg-gray-300 disabled:text-gray-500',
              TextClassname: 'text-sm sm:text-xl',
              hoverTransform: false,
              loading: fetchTracking.isLoading,
            }}
            className={clsx(hasHistory ? 'pl-16' : 'pl-4')}
            onFocus={() => {
              mixpanel.track(MIXPANEL_EVENT.INPUT_STATS, { status: EVENTS_STATUS.OK });
            }}
          />
        </form>
        <p className="mt-4 text-red-400">{error}</p>
        <FeedbackLink template={FeedbackTemplate.URL_TRACKING} />
      </div>
    </Accordion>
  );
};
