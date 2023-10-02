import { Input } from 'components/atoms/Input';
import { Modal } from 'components/atoms/Modal';
import { FeedbackLink, FeedbackTemplate } from 'components/sections/FeedbackLink';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { verifyPasswordRequest } from 'requests';
import { useTrans } from 'utils/i18next';

type ValidatePasswordForm = { password: string };

export const ValidatePassword = ({ open, hash }: { hash: string; open?: boolean }) => {
  const { t } = useTrans();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ValidatePasswordForm>();
  const router = useRouter();
  const [maxTime, setMaxTime] = useState(0);

  const onSubmit: SubmitHandler<ValidatePasswordForm> = async (data) => {
    if (maxTime > 5) {
      setError('password', {
        message: t('inputManyTimes'),
      });
      return;
    }
    try {
      const rs = await verifyPasswordRequest({ h: hash, p: data.password });
      if (rs.token) {
        localStorage.setItem('quickshare-token', rs.token);
        window.location.reload();
      }
    } catch (error) {
      setError('password', {
        message: t('errorInvalidInput'),
      });
    }
    setMaxTime((_m) => _m + 1);
  };

  return (
    <div>
      <Modal
        open={open}
        id="validatePassword"
        title={t('unlock')}
        ConfirmButtonProps={{
          onClick: handleSubmit(onSubmit),
        }}
        modalOptions={{
          backdrop: 'static',
          keyboard: false,
        }}
        DismissButtonProps={{
          onClick: () => {
            router.push('/');
          },
        }}
        blockDismiss>
        <div className="pt-2">
          <label className="text-gray-700">{t('requiredPasswordLabel')}</label>
          <Input
            className="mt-2 h-12"
            {...register('password', {
              required: { message: t('errorNoInput'), value: true },
            })}
          />
          <p className="mt-2 text-red-400">{errors.password?.message}</p>
        </div>
        <div className="pt-2">
          <FeedbackLink template={FeedbackTemplate.FORGOT_PASSWORD} displayText={t('forgotPassword')} />
        </div>
      </Modal>
    </div>
  );
};
