import { getOrCreateShortenUrlRequest } from 'api/requests';
import { AxiosError } from 'axios';
import { useBearStore } from 'bear';
import { InputWithButton } from 'components/atoms/Input';
import { HelpTooltip } from 'components/gadgets/HelpTooltip';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { URLShortenerResult } from 'components/sections/URLShortenerResult';
import { URLStats } from 'components/sections/URLStatsInput';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { HASH } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { encrypt } from 'utils/crypto';
import { useTrans } from 'utils/i18next';
import { QueryKey } from 'utils/requests';
import { urlRegex } from 'utils/text';

type URLShortenerForm = {
  url: string;
};

const URLShortenerInput = () => {
  const router = useRouter();
  const [localError, setLocalError] = useState('');
  const { shortenSlice } = useBearStore();
  const { t } = useTrans('common');

  const [shortenUrl, setShortenHistory] = shortenSlice((state) => [state.getShortenUrl(), state.setShortenHistory]);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<URLShortenerForm>();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = query.get('hash') || '';
    if (HASH.Regex.test(hash)) {
      requestShortenUrl.mutate({ hash });
    }
  }, []);

  const requestShortenUrl = useMutation(QueryKey.SHORTEN, getOrCreateShortenUrlRequest, {
    onMutate: (variables) => {
      setLocalError('');
    },
    onError: (error, variables, context) => {
      mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
        status: MIXPANEL_STATUS.FAILED,
        errorMessage: error,
        urlRaw: variables,
      });
    },
    onSuccess: (data, variables, context) => {
      if (data.hash && data.url) {
        setShortenHistory(data);
        queryClient.invalidateQueries(QueryKey.RECORD);
        setValue('url', data.url);
        mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
          status: MIXPANEL_STATUS.OK,
          data,
        });
        const queryParams = { ...router.query, ...{ hash: data.hash } };
        router.push({ pathname: router.pathname, query: queryParams });
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
    requestShortenUrl.mutate({ url: encodeURIComponent(encrypt(data.url)) });
  };

  const mutateError = requestShortenUrl.error as AxiosError;
  const error = errors.url?.message /** form */ || mutateError?.message || localError;
  const loading = requestShortenUrl.isLoading;
  const hasData = !loading && !requestShortenUrl.isError;

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
    <div className="solid container mx-auto max-w-5xl rounded-lg border p-4 pt-8 shadow-xl sm:px-8 sm:py-8 sm:pt-10">
      <h1 className="mb-4 flex gap-1 text-3xl">
        {t('urlShortener')}
        <HelpTooltip text={t('helpShortUrlHead')} />
      </h1>
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
          disabled={loading}
          buttonProps={{
            animation: true,
            hoverTransform: false,
            text: t('generate'),
            variant: 'filled',
            type: 'submit',
            loading,
            TextClassname: 'text-sm sm:text-xl',
          }}
          onFocus={() => {
            mixpanel.track(MIXPANEL_EVENT.INPUT_URL, { status: MIXPANEL_STATUS.OK });
          }}
          className="pl-5"
        />
      </form>
      <p className="mt-4 text-red-400">{error}</p>
      {hasData && shortenUrl && <URLShortenerResult />}
      <FeedbackLink template={FeedbackTemplate.URL_SHORT} />
    </div>
  );
};

export const UrlShortener = () => {
  const { t } = useTrans('common');
  return (
    <div>
      <URLShortenerInput />
      <div className="my-16"></div>
      <URLStats />
    </div>
  );
};
