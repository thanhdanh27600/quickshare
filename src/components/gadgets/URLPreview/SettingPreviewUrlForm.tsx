import { ErrorMessage } from '@hookform/error-message';
import { UrlShortenerHistory } from '@prisma/client';
import { Button } from 'components/atoms/Button';
import { Input, Textarea } from 'components/atoms/Input';
import { logEvent } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';
import dynamic from 'next/dynamic';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';
import { updateShortenUrlRequest } from 'requests';
import { useBearStore } from 'store';
import { LIMIT_OG_DESCRIPTION_LENGTH, LIMIT_OG_TITLE_LENGTH, brandUrlShortDomain } from 'types/constants';
import { Locale } from 'types/locale';
import { EVENTS_STATUS, FIREBASE_ANALYTICS_EVENT, MIXPANEL_EVENT } from 'types/utils';
import { debounce } from 'utils/data';
import { analytics } from 'utils/firebase';
import { useTrans } from 'utils/i18next';
import { logger } from 'utils/logger';
import { QueryKey } from 'utils/requests';

type ShortenSettingPayload = Partial<UrlShortenerHistory> & { locale?: Locale };

const ImageUploader = dynamic(() => import('../../atoms/ImageUploader').then((mod) => mod.ImageUploader));

export const SettingPreviewUrlForm = () => {
  const { t, locale } = useTrans();
  const { shortenSlice } = useBearStore();
  const [shortenHistory, shortenHistoryMediaId, setShortenHistory, setShortenHistoryMediaId] = shortenSlice((state) => [
    state.shortenHistory,
    state.shortenHistoryMediaId,
    state.setShortenHistory,
    state.setShortenHistoryMediaId,
  ]);
  const defaultValues = {
    ogTitle: shortenHistory?.ogTitle || t('ogTitle', { hash: shortenHistory?.hash ?? 'XXX' }),
    ogDescription: shortenHistory?.ogDescription || t('ogDescription'),
    ogDomain: shortenHistory?.ogDomain || brandUrlShortDomain,
    ogImgSrc: shortenHistory?.ogImgSrc,
    theme: shortenHistory?.theme,
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ShortenSettingPayload>({
    defaultValues,
  });

  const onUpdateImgSrc = ({ url, mediaId, ogImgPublicId }: any) => {
    setValue('ogImgSrc', url);
    setValue('ogImgPublicId', ogImgPublicId);
    setShortenHistoryMediaId(mediaId);
    setShortenHistory({ ogImgSrc: url });
  };

  const handleUpdate = useCallback((history: ShortenSettingPayload) => {
    setShortenHistory(history);
  }, []);

  const debouncedUpdate = useCallback(debounce(handleUpdate, 600), []);

  const [ogTitle, ogDescription] = watch(['ogTitle', 'ogDescription']);

  useEffect(() => {
    debouncedUpdate({
      ogTitle,
      ogDescription,
    });
  }, [ogTitle, ogDescription]);

  useEffect(() => {
    debouncedUpdate({
      ogTitle: shortenHistory?.ogTitle || t('ogTitle', { hash: shortenHistory?.hash ?? 'XXX' }),
      ogDescription: shortenHistory?.ogDescription || t('ogDescription'),
      ogImgSrc: shortenHistory?.ogImgSrc,
    });
  }, []);

  const updateShortenUrl = useMutation(QueryKey.SHORTEN_UPDATE, {
    mutationFn: updateShortenUrlRequest,
    onError: (error: any) => {
      try {
        const log = { status: EVENTS_STATUS.FAILED, error: error.toString() };
        mixpanel.track(MIXPANEL_EVENT.SHORTEN_UPDATE, log);
        logEvent(analytics, FIREBASE_ANALYTICS_EVENT.SHORTEN_UPDATE, log);
      } catch (error) {
        logger.error(error);
      }
      logger.error(error);
      toast.error(t('somethingWrong'));
    },
    onSuccess: async (data) => {
      mixpanel.track(MIXPANEL_EVENT.SHORTEN_UPDATE, { status: EVENTS_STATUS.OK, data });
      toast.success(t('updated'));
    },
  });

  const onSubmit: SubmitHandler<ShortenSettingPayload> = async (values) => {
    if (!shortenHistory?.hash) return;
    updateShortenUrl.mutate({
      hash: shortenHistory.hash,
      locale,
      mediaId: shortenHistoryMediaId || undefined,
      ogImgSrc: values.ogImgSrc || undefined,
      ogImgPublicId: values.ogImgPublicId || undefined,
      ogDescription: values.ogDescription?.trim() || undefined,
      ogTitle: values.ogTitle?.trim() || undefined,
      theme: shortenHistory.theme,
    });
  };

  if (!shortenHistory) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4">
        <div>
          <label>{t('uploadImage')}</label>
          <div className="mt-2">
            <ImageUploader onSuccess={onUpdateImgSrc} />
          </div>
          <div className="mt-4">
            <label>{t('title')}</label>
            <Input
              btnSize="md"
              {...register('ogTitle', {
                required: { message: t('errorNoInput'), value: true },
                maxLength: {
                  message: t('maximumCharaters', { n: LIMIT_OG_TITLE_LENGTH }),
                  value: LIMIT_OG_TITLE_LENGTH,
                },
              })}
              maxLength={LIMIT_OG_TITLE_LENGTH}
              disabled={updateShortenUrl.isLoading}
            />
            <ErrorMessage
              errors={errors}
              name="ogTitle"
              render={(error) => <p className="text-red-400">{error.message}</p>}
            />
          </div>
        </div>
        <div className="mt-4">
          <label>{t('description')}</label>
          <Textarea
            {...register('ogDescription', {
              required: { message: t('errorNoInput'), value: true },
              maxLength: {
                message: t('maximumCharaters', { n: LIMIT_OG_DESCRIPTION_LENGTH }),
                value: LIMIT_OG_DESCRIPTION_LENGTH,
              },
            })}
            maxLength={LIMIT_OG_DESCRIPTION_LENGTH}
            rows={3}
            disabled={updateShortenUrl.isLoading}
          />
          <ErrorMessage
            errors={errors}
            name="ogDescription"
            render={(error) => <p className="text-red-400">{error.message}</p>}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" text={t('save')} className="mt-4 " loading={updateShortenUrl.isLoading} />
        </div>
      </div>
    </form>
  );
};
