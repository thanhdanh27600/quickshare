import { createShortenUrlRequest } from 'api/requests';
import { AxiosError } from 'axios';
import { InputWithButton } from 'components/atoms/Input';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { URLShortenerResult } from 'components/sections/URLShortenerResult';
import mixpanel from 'mixpanel-browser';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { BASE_URL } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { urlRegex } from 'utils/text';

type URLShortenerForm = {
  url: string;
};

export const URLShortenerInput = () => {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [localError, setLocalError] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useTrans('common');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<URLShortenerForm>();

  const createShortenUrl = useMutation('shortenUrl', createShortenUrlRequest, {
    onMutate: (variables) => {
      setLocalError('');
    },
    onError: (error, variables, context) => {
      console.log(`An error happened!`, error);
      mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
        status: MIXPANEL_STATUS.FAILED,
        errorMessage: error,
        urlRaw: variables,
      });
    },
    onSuccess: (data, variables, context) => {
      // console.log('data, variables, context', data, variables, context);
      if (data.hash) {
        setShortenedUrl(`${BASE_URL}/${data.hash}`);
        mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
          status: MIXPANEL_STATUS.OK,
          ...data,
        });
      } else {
        setLocalError(t('somethingWrong'));
        mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
          status: MIXPANEL_STATUS.INTERNAL_ERROR,
          urlRaw: variables,
        });
      }
    },
  });

  const onSubmit: SubmitHandler<URLShortenerForm> = (data) => {
    setCopied(false);
    createShortenUrl.mutate(data.url);
  };

  const mutateError = createShortenUrl.error as AxiosError;
  const error = errors.url?.message /** form */ || mutateError?.message || localError;
  const loading = createShortenUrl.isLoading;
  const hasData = !loading && !createShortenUrl.isError;

  useEffect(() => {
    if (error && isSubmitting) {
      mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
        status: MIXPANEL_STATUS.FAILED,
        errorMessage: error,
        url: getValues('url'),
      });
    }
  }, [isSubmitting]);

  return (
    <div className="solid rounded-lg border p-4 shadow-card sm:px-8 sm:py-8 sm:pt-10">
      <h1 className="mb-4 text-4xl">{t('urlShortener')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <InputWithButton
          placeholder="https://example.com"
          {...register('url', {
            required: { message: t('errorNoUrl'), value: true },
            pattern: {
              message: t('errorInvalidUrl'),
              value: urlRegex,
            },
          })}
          buttonProps={{
            text: t('generate'),
            variant: 'filled',
            type: 'submit',
            loading,
          }}
          onFocus={() => {
            mixpanel.track(MIXPANEL_EVENT.INPUT_URL, { status: MIXPANEL_STATUS.OK });
          }}
        />
      </form>
      <p className="mt-4 text-red-400">{error}</p>
      {hasData && shortenedUrl && (
        <URLShortenerResult shortenedUrl={shortenedUrl} setCopied={setCopied} copied={copied} />
      )}
      <FeedbackLink template={FeedbackTemplate.URL_SHORT} />
    </div>
  );
};
