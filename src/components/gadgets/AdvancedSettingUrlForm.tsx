import { ErrorMessage } from '@hookform/error-message';
import { UrlShortenerHistory } from '@prisma/client';
import { updateShortenUrlRequest } from 'api/requests';
import { useBearStore } from 'bear';
import { Button } from 'components/atoms/Button';
import { Input, Textarea } from 'components/atoms/Input';
import mixpanel from 'mixpanel-browser';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';
import { LIMIT_OG_DESCRIPTION_LENGTH, LIMIT_OG_TITLE_LENGTH, brandUrlShortDomain } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { debounce } from 'utils/data';
import { useTrans } from 'utils/i18next';
import { logger } from 'utils/logger';
import { QueryKey } from 'utils/requests';

export const AdvancedSettingUrlForm = () => {
  const { t } = useTrans();
  const { shortenSlice } = useBearStore();
  const [shortenHistory, setShortenHistoryForm] = shortenSlice((state) => [
    state.shortenHistory,
    state.setShortenHistoryForm,
  ]);
  const defaultValues = {
    ogTitle: shortenHistory?.ogTitle ?? t('ogTitle', { hash: shortenHistory?.hash ?? 'XXX' }),
    ogDescription: shortenHistory?.ogDescription ?? t('ogDescription'),
    ogDomain: shortenHistory?.ogDomain ?? brandUrlShortDomain,
    ogImgSrc: shortenHistory?.ogImgSrc,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Partial<UrlShortenerHistory>>({
    defaultValues,
  });

  const handleUpdate = useCallback((history: Partial<UrlShortenerHistory>) => {
    setShortenHistoryForm(history);
  }, []);

  const debouncedUpdate = useCallback(debounce(handleUpdate, 1000), []);

  const [ogTitle, ogDescription] = watch(['ogTitle', 'ogDescription']);

  useEffect(() => {
    debouncedUpdate({
      ...shortenHistory,
      ogTitle,
      ogDescription,
    });
  }, [ogTitle, ogDescription, shortenHistory]);

  const updateShortenUrl = useMutation(QueryKey.SHORTEN_UPDATE, {
    mutationFn: updateShortenUrlRequest,
    onError: (error: any) => {
      try {
        mixpanel.track(MIXPANEL_EVENT.SHORTEN_UPDATE, { status: MIXPANEL_STATUS.FAILED, error: error.toString() });
      } catch (error) {
        logger.error(error);
      }
      logger.error(error);
      toast.error(t('somethingWrong'));
    },
    onSuccess: async (data) => {
      mixpanel.track(MIXPANEL_EVENT.SHORTEN_UPDATE, { status: MIXPANEL_STATUS.OK, data });
      toast.success(t('updated'));
    },
  });

  const onSubmit: SubmitHandler<Partial<UrlShortenerHistory>> = async (values) => {
    if (!shortenHistory?.hash) return;
    updateShortenUrl.mutate({
      hash: shortenHistory.hash,
      ogDescription: values.ogDescription || undefined,
      ogTitle: values.ogTitle || undefined,
    });
  };

  if (!shortenHistory) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4">
        <div>
          <label>Title</label>
          <Input
            btnSize="md"
            {...register('ogTitle', {
              required: { message: t('errorNoInput'), value: true },
              maxLength: { message: `Maximum of ${LIMIT_OG_TITLE_LENGTH} charactors`, value: LIMIT_OG_TITLE_LENGTH },
            })}
            disabled={updateShortenUrl.isLoading}
          />
          <ErrorMessage
            errors={errors}
            name="ogTitle"
            render={(error) => <p className="mt-4 text-red-400">{error.message}</p>}
          />
        </div>
        <div className="mt-4">
          <label>Description</label>
          <Textarea
            {...register('ogDescription', {
              required: { message: t('errorNoInput'), value: true },
              maxLength: { message: `Maximum of ${LIMIT_OG_DESCRIPTION_LENGTH}}`, value: LIMIT_OG_DESCRIPTION_LENGTH },
            })}
            rows={3}
            disabled={updateShortenUrl.isLoading}
          />
        </div>
        <Button type="submit" text={t('save')} className="mt-4" loading={updateShortenUrl.isLoading} />
      </div>
    </form>
  );
};
