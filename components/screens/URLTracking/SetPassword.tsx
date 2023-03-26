import { getStats } from 'api/requests';
import { Button } from 'components/atoms/Button';
import { Input } from 'components/atoms/Input';
import { Modal } from 'components/atoms/Modal';
import mixpanel from 'mixpanel-browser';
import { useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';
import { logger } from 'utils/logger';
import { emailRegex } from 'utils/text';

type PasswordForm = {
  password: string;
  email: string;
};

export const SetPassword = ({ hash, setToken }: { hash: string; setToken: (password: string) => void }) => {
  const { t } = useTrans();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>();

  const closeModalRef = useRef<HTMLButtonElement>(null);

  const setPassword = useMutation('setPassword', {
    mutationFn: getStats,
    onError: (error: any) => {
      try {
        mixpanel.track(MIXPANEL_EVENT.SET_PASSWORD, { status: MIXPANEL_STATUS.FAILED, error: error.toString() });
      } catch (error) {
        logger.error(error);
      }
      logger.error(error);
      toast.error(t('somethingWrong'));
    },
    onSuccess: async (data) => {
      mixpanel.track(MIXPANEL_EVENT.SET_PASSWORD, { status: MIXPANEL_STATUS.OK });
      await queryClient.invalidateQueries('forward');
      closeModalRef.current?.click();
      data.history && setToken(data.history[0].password || '');
      toast.success(t('updated'));
    },
  });

  const onSubmit: SubmitHandler<PasswordForm> = (data) => {
    setPassword.mutate({ hash, email: data.email, password: data.password });
  };

  return (
    <div>
      <Button
        text={t('setPassword')}
        variant="outlined"
        data-te-toggle="modal"
        data-te-target="#setPassword"
        onClick={() => {
          mixpanel.track(MIXPANEL_EVENT.OPEN_SET_PASSWORD, { status: MIXPANEL_STATUS.OK });
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
              pattern: {
                value: emailRegex,
                message: t('errorInvalidEmail'),
              },
            })}
          />
          <p className="mt-2 text-red-400">{errors.email?.message}</p>
        </div>
      </Modal>
    </div>
  );
};
