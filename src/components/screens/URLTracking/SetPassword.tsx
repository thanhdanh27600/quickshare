import { Button } from 'components/atoms/Button';
import { Checkbox } from 'components/atoms/Checkbox';
import { Input } from 'components/atoms/Input';
import { Modal } from 'components/atoms/Modal';
import { logEvent } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';
import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { setPasswordRequest } from 'requests';
import { EVENTS_STATUS, FIREBASE_ANALYTICS_EVENT, MIXPANEL_EVENT } from 'types/utils';
import { analytics } from 'utils/firebase';
import { useTrans } from 'utils/i18next';
import { logger } from 'utils/logger';
import { QueryKey } from 'utils/requests';
import { emailRegex } from 'utils/text';

type PasswordForm = {
  password: string;
  email: string;
  usePasswordForward: boolean;
};

export const SetPassword = ({ hash, onSetPasswordSuccess }: { hash: string; onSetPasswordSuccess?: () => void }) => {
  const { t } = useTrans();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({ defaultValues: { usePasswordForward: true } });

  const closeModalRef = useRef<HTMLButtonElement>(null);

  const setPassword = useMutation(QueryKey.SET_PASSWORD, {
    mutationFn: setPasswordRequest,
    onError: (error: any) => {
      try {
        const log = {
          status: EVENTS_STATUS.FAILED,
          error: error.toString(),
        };
        mixpanel.track(MIXPANEL_EVENT.SET_PASSWORD, log);
        logEvent(analytics, FIREBASE_ANALYTICS_EVENT.SET_PASSWORD, log);
      } catch (error) {
        logger.error(error);
      }
      logger.error(error);
      toast.error(t('somethingWrong'));
    },
    onSuccess: async (data) => {
      mixpanel.track(MIXPANEL_EVENT.SET_PASSWORD, { status: EVENTS_STATUS.OK, data });
      await queryClient.invalidateQueries(QueryKey.STATS);
      if (onSetPasswordSuccess) onSetPasswordSuccess();
      closeModalRef.current?.click();
      toast.success(t('updated'));
    },
  });

  const onSubmit: SubmitHandler<PasswordForm> = (data) => {
    setPassword.mutate({
      hash,
      email: data.email,
      password: data.password,
      usePasswordForward: data.usePasswordForward,
    });
  };

  return (
    <div>
      <Button
        text={t('setPassword')}
        variant="outlined"
        data-te-toggle="modal"
        data-te-target="#setPassword"
        onClick={() => {
          mixpanel.track(MIXPANEL_EVENT.OPEN_SET_PASSWORD, { status: EVENTS_STATUS.OK });
        }}
      />
      <button
        ref={closeModalRef}
        type="button"
        className="hidden"
        data-te-toggle="modal"
        data-te-target="#setPassword"
      />
      <Modal
        id="setPassword"
        title={t('setPassword')}
        ConfirmButtonProps={{
          onClick: handleSubmit(onSubmit),
        }}>
        <div className="py-2">
          <label className="text-gray-700">{t('requiredPasswordLabel')}</label>
          <Input
            className="mt-2 h-12"
            {...register('password', {
              required: { message: t('errorNoInput'), value: true },
              minLength: {
                value: 6,
                message: t('minCharacter', { n: 6 }),
              },
            })}
          />
          <p className="mt-2 text-red-400">{errors.password?.message}</p>
        </div>
        <div className="py-2">
          <label className="text-gray-700">{t('emailRecoverLabel')}</label>
          <Input
            className="mt-2 h-12"
            {...register('email', {
              required: { message: t('errorNoInput'), value: true },
              pattern: {
                value: emailRegex,
                message: t('errorInvalidEmail'),
              },
            })}
          />
          <p className="mt-2 text-red-400">{errors.email?.message}</p>
        </div>
        <div className="py-2">
          <Checkbox label={t('usePasswordToShortenedLink')} {...register('usePasswordForward')} />
        </div>
      </Modal>
    </div>
  );
};
