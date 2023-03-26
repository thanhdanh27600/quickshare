import { Input } from 'components/atoms/Input';
import { Modal } from 'components/atoms/Modal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm, UseFormSetError } from 'react-hook-form';
import { useTrans } from 'utils/i18next';

type ValidatePasswordForm = { password: string };

export const ValidateToken = ({
  setToken,
  open,
}: {
  setToken: (password: string, setError: UseFormSetError<ValidatePasswordForm>) => void;
  open: boolean;
}) => {
  const { t } = useTrans();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ValidatePasswordForm>();
  const router = useRouter();
  const [maxTime, setMaxTime] = useState(0);

  const onSubmit: SubmitHandler<ValidatePasswordForm> = (data) => {
    if (maxTime > 5) {
      setError('password', {
        message: t('inputManyTimes'),
      });
      return;
    }
    setToken(data.password, setError);
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
        <div className="py-2">
          <label className="text-gray-700">{t('requiredPasswordLabel')}</label>
          <Input
            className="mt-2 h-12"
            {...register('password', {
              required: { message: t('errorNoInput'), value: true },
            })}
          />
          <p className="mt-2 text-red-400">{errors.password?.message}</p>
        </div>
      </Modal>
    </div>
  );
};
