import { createShortenUrlRequest } from 'api/requests';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { InputWithButton } from 'components/atoms/Input';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { BASE_URL } from 'types/constants';
import { copyToClipBoard, urlRegex } from 'utils/text';

type URLShortenerForm = {
  url: string;
};

export const URLShortener = () => {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [localError, setLocalError] = useState('');
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    copyToClipBoard(shortenedUrl);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<URLShortenerForm>();

  const createShortenUrl = useMutation('shortenUrl', createShortenUrlRequest, {
    onMutate: (variables) => {
      console.log('A mutation is about to happen!');
    },
    onError: (error, variables, context) => {
      console.log('error', error);
      console.log(`An error happened!`);
    },
    onSuccess: (data, variables, context) => {
      console.log('data, variables, context', data, variables, context);
      if (data.hash) setShortenedUrl(`${BASE_URL}/${data.hash}`);
      else {
        setLocalError('Something wrong happened :(');
      }
    },
  });

  const serverError = createShortenUrl.error as AxiosError;

  const onSubmit: SubmitHandler<URLShortenerForm> = (data) => {
    setCopied(false);
    createShortenUrl.mutate(data.url);
  };

  const error = errors.url?.message || serverError?.message || localError;
  const loading = createShortenUrl.isLoading;
  const hasData = !loading && !createShortenUrl.isError;

  return (
    <div className="solid rounded-lg border p-4">
      <h1 className="mb-4 text-4xl">URL Shortener</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <InputWithButton
          placeholder="https://example.com"
          {...register('url', {
            required: { message: 'Vui lòng nhập URL để tiếp tục', value: true },
            pattern: {
              message: 'URL không hợp lệ, hãy thử lại',
              value: urlRegex,
            },
          })}
          buttonProps={{
            text: 'Generate',
            variant: 'filled',
            type: 'submit',
            loading,
          }}
        />
      </form>
      <p className="mt-4 text-red-400">{error}</p>
      {hasData && shortenedUrl && (
        <div className="mt-4">
          <h3>Rút gọn link thành công!</h3>
          <div className="mt-2 flex flex-wrap justify-between border-gray-200 bg-gray-100 px-3 py-10">
            <a href={shortenedUrl} target="_blank">
              <p
                className="text-lg font-bold transition-all hover:text-cyan-500 hover:underline sm:text-2xl"
                title={shortenedUrl}>
                {shortenedUrl}
              </p>
            </a>
            <button
              title="Copy"
              type="button"
              data-copy-state="copy"
              onClick={onCopy}
              className={clsx(
                'flex items-center border-l-2 pl-2 text-sm font-medium text-gray-600 transition-all hover:text-cyan-500 sm:text-lg',
                copied && '!text-cyan-500',
              )}>
              <svg
                className="mr-2 h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>{' '}
              <span className="">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
