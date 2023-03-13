import { InputWithButton } from 'components/atoms/Input';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
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
    router.push(`/v/${data.hash.replace(BASE_URL + '/', '')}`);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<URLStatsForm>();

  const error = errors.hash?.message; /** form */

  return (
    <div className="solid rounded-lg border p-4 py-8 shadow-card sm:px-8 sm:py-8 sm:pt-10">
      <h1 className="mb-4 text-4xl">{t('tracking')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <InputWithButton
          placeholder={`${BASE_URL}/xxxxx`}
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
          }}
          onFocus={() => {
            mixpanel.track(MIXPANEL_EVENT.INPUT_STATS, { status: MIXPANEL_STATUS.OK });
          }}
        />
      </form>
      <p className="mt-4 text-red-400">{error}</p>
      <FeedbackLink template={FeedbackTemplate.URL_STATS} />
    </div>
  );
};
