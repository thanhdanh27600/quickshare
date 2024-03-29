import { AxiosError } from 'axios';
import { InputWithButton } from 'components/atoms/Input';
import { CustomLinkForm } from 'components/gadgets/URLShortener/CustomLinkForm';
import { SignInToCustomLink } from 'components/gadgets/URLShortener/SignInToCustomLink';
import { HelpTooltip } from 'components/gadgets/shared/HelpTooltip';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { URLShortenerResult } from 'components/sections/URLShortenerResult';
import { URLStats } from 'components/sections/URLStatsInput';
import { logEvent } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { getOrCreateShortenUrlRequest } from 'requests';
import { useBearStore } from 'store';
import { LIMIT_FEATURE_HOUR, LIMIT_SHORTEN_REQUEST } from 'types/constants';
import { EVENTS_STATUS, FIREBASE_ANALYTICS_EVENT, MIXPANEL_EVENT } from 'types/utils';
import { encrypt } from 'utils/crypto';
import { analytics } from 'utils/firebase';
import { useTrans } from 'utils/i18next';
import { QueryKey } from 'utils/requests';
import { validateUrl } from 'utils/validateMiddleware';

type URLShortenerForm = {
  url: string;
  hash?: string;
};

export const UrlShortener = () => {
  return (
    <div>
      <URLShortenerInput />
      <div className="my-16"></div>
      <URLStats />
    </div>
  );
};

const URLShortenerInput = () => {
  const router = useRouter();
  const [localError, setLocalError] = useState('');
  const { shortenSlice } = useBearStore();
  const { t } = useTrans('common');

  const [url, shortenUrl, setShortenHistory] = shortenSlice((state) => [
    state.getUrl(),
    state.getShortenUrl(),
    state.setShortenHistory,
  ]);
  const queryClient = useQueryClient();

  const methods = useForm<URLShortenerForm>();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = methods;

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = query.get('hash') || '';
    if (!!hash) requestShortenUrl.mutate({ hash });
  }, []);

  const requestShortenUrl = useMutation(QueryKey.SHORTEN, getOrCreateShortenUrlRequest, {
    onMutate: (variables) => {
      setLocalError('');
    },
    onError: (error: any, variables, context) => {
      const log = {
        status: EVENTS_STATUS.FAILED,
        errorMessage: error,
        urlRaw: variables,
      };
      mixpanel.track(MIXPANEL_EVENT.SHORTEN, log);
      logEvent(analytics, FIREBASE_ANALYTICS_EVENT.SHORTEN, log);
    },
    onSuccess: (data, variables, context) => {
      if (data.hash && data.url) {
        setShortenHistory(data);
        queryClient.invalidateQueries(QueryKey.RECORD);
        setValue('url', data.url);
        mixpanel.track(MIXPANEL_EVENT.SHORTEN, {
          status: EVENTS_STATUS.OK,
          data,
        });
        const queryParams = { ...router.query, ...{ hash: data.hash } };
        router.push({ pathname: router.pathname, query: queryParams });
      } else {
        setLocalError(t('somethingWrong'));
        const log = {
          status: EVENTS_STATUS.INTERNAL_ERROR,
          urlRaw: variables,
        };
        mixpanel.track(MIXPANEL_EVENT.SHORTEN, log);
        logEvent(analytics, FIREBASE_ANALYTICS_EVENT.SHORTEN, log);
      }
    },
  });

  const onSubmit: SubmitHandler<URLShortenerForm> = (data) => {
    requestShortenUrl.mutate({ url: encodeURIComponent(encrypt(data.url)), customHash: data.hash });
  };

  const mutateError = (requestShortenUrl.error as AxiosError)?.message;
  const requestErrorMessage = useMemo(() => {
    let errorMessage;
    switch (mutateError) {
      case 'EXCEEDED_SHORT':
        errorMessage = t('reachedFeatureLimit', {
          n: LIMIT_SHORTEN_REQUEST,
          feature: t('shortenedURL'),
          time: `${LIMIT_FEATURE_HOUR} ${t('hour')}`,
        });
        break;
      case 'EXIST_HASH':
        errorMessage = t('EXIST_HASH');
        break;
      default:
        errorMessage = mutateError;
        break;
    }
    return errorMessage;
  }, [mutateError]);

  const formError = errors.url?.message || errors.hash?.message;
  const error = formError || localError || requestErrorMessage;
  const loading = requestShortenUrl.isLoading;
  const hasData = !loading && !requestShortenUrl.isError && shortenUrl;

  useEffect(() => {
    if (error && isSubmitting) {
      const log = {
        status: EVENTS_STATUS.FAILED,
        errorMessage: error,
        url: getValues('url'),
      };
      mixpanel.track(MIXPANEL_EVENT.SHORTEN, log);
      logEvent(analytics, FIREBASE_ANALYTICS_EVENT.SHORTEN, log);
    }
  }, [isSubmitting]);

  return (
    <FormProvider {...methods}>
      <div
        className={`${
          loading || shortenUrl ? 'border-animate' : 'border'
        } container mx-auto max-w-5xl p-4 pt-8 shadow-xl sm:px-8 sm:py-8 sm:pt-10`}>
        <h1 className="mb-4 flex gap-1 text-xl md:text-3xl">
          {t('urlShortener')}
          <HelpTooltip text={t('helpShortUrlHead')} />
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <InputWithButton
            placeholder={url || 'https://example.com'}
            {...register('url', {
              required: { message: t('errorNoUrl'), value: true },
              validate: (text) => {
                const error = validateUrl(text);
                return error ? t(error) : undefined;
              },
            })}
            disabled={!!shortenUrl || loading}
            buttonProps={{
              animation: true,
              hoverTransform: false,
              text: t('generate'),
              variant: 'filled',
              type: 'submit',
              disabled: !!shortenUrl,
              loading,
              TextClassname: 'text-sm sm:text-xl',
            }}
            onFocus={() => {
              mixpanel.track(MIXPANEL_EVENT.INPUT_URL, { status: EVENTS_STATUS.OK });
            }}
            className="pl-5"
          />
        </form>
        <CustomLinkForm />
        <SignInToCustomLink />
        <p className="mt-4 text-red-400">{error}</p>
        {hasData && <URLShortenerResult />}
        <FeedbackLink template={FeedbackTemplate.URL_SHORT} />
      </div>
    </FormProvider>
  );
};
