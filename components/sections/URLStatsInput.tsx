import { getStats } from 'api/requests';
import clsx from 'clsx';
import { InputWithButton } from 'components/atoms/Input';
import { Accordion } from 'components/gadgets/Accordion';
import { Dropdown } from 'components/gadgets/Dropdown';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { BASE_URL } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { FeedbackLink, FeedbackTemplate } from './FeedbackLink';

type URLStatsForm = {
  hash: string;
};

export const URLStats = () => {
  const router = useRouter();
  const { t } = useTrans();

  const onSubmit: SubmitHandler<URLStatsForm> = (data) => {
    fetchTracking.mutate({ hash: data.hash.replace(BASE_URL + '/', '') });
  };

  const fetchTracking = useMutation('fetchTracking', getStats);
  const fetchRecord = useQuery({ queryKey: 'fetchRecord', queryFn: async () => getStats({ hash: '' }) });

  const hasHistory = fetchRecord.data?.history?.length || 0 > 0;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm<URLStatsForm>({
    defaultValues: { hash: hasHistory ? `${BASE_URL}/${fetchRecord.data?.history![0].hash}` : '' },
  });

  const error = errors.hash?.message; /** form error */

  useEffect(() => {
    if (!fetchTracking.isSuccess) return;
    if (!fetchTracking.data?.history) {
      setError('hash', {
        message: t('errorNoTracking'),
      });
    } else {
      router.replace(`/v/${getValues('hash').replace(BASE_URL + '/', '')}`);
    }
  }, [fetchTracking.isSuccess]);

  const title = [
    <span className="relative" key="accordion-viewmore">
      {t('viewMore')}
      {hasHistory && (
        <span className="absolute bottom-2 -right-6 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-sm">
          {fetchRecord.data?.history?.length}
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
            placeholder={`${BASE_URL}/xxxxx`}
            Prefix={
              hasHistory ? (
                <Dropdown
                  ContainerProps={{ className: 'absolute h-55 w-fit text-sm' }}
                  options={(fetchRecord.data?.history || []).map((h, idx) => ({
                    label: `${idx + 1}. ${h.url} (${h.hash})`,
                    value: `${BASE_URL}/${h.hash}`,
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
                return values.startsWith(BASE_URL) && /^.{5}$/.test(values.replace(BASE_URL + '/', ''))
                  ? undefined
                  : t('errorInvalidForward', { name: `${BASE_URL}/xxxxx` });
              },
            })}
            buttonProps={{
              text: t('continue'),
              variant: 'filled',
              type: 'submit',
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
