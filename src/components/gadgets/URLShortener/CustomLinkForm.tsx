import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBearStore } from 'store';
import { HASH, HASH_CUSTOM, RESERVED_HASH, brandUrlShortDomain } from 'types/constants';
import { useTrans } from 'utils/i18next';

export const CustomLinkForm = () => {
  const { t } = useTrans();
  const { shortenSlice } = useBearStore();
  const [shortenHistory] = shortenSlice((state) => [state.shortenHistory]);
  const { data: session } = useSession();

  const {
    register,
    resetField,
    formState: { errors },
  } = useFormContext<{ hash: string }>();

  useEffect(() => {
    if (shortenHistory?.hash) resetField('hash', { defaultValue: shortenHistory.hash });
  }, [shortenHistory?.hash, session?.user]);

  if (!session) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center text-sm">
      <p className="text-gray-500">
        <span>{t('customLink')}</span> {brandUrlShortDomain}
        {'/'}
      </p>
      <div className="w-full max-w-[8rem] sm:max-w-[12rem]">
        <div className={`flex items-center border-b ${!!errors.hash ? 'border-red-500' : 'border-cyan-500'}`}>
          <input
            {...register('hash', {
              validate: (hash) => {
                if (!hash) return;
                if (hash.length < HASH.Length) return t('minCharacter', { n: HASH.Length });
                if (hash.length > HASH_CUSTOM.MaxLength) return t('maximumCharaters', { n: HASH_CUSTOM.MaxLength });
                if (!/^[a-zA-Z0-9]$/.test(hash?.[0])) return t('errorInvalidUrl');
                if (RESERVED_HASH.has(hash)) return t('errorInvalidUrl');
                if (!HASH_CUSTOM.Regex.test(hash)) return t('customHashError');
              },
            })}
            autoComplete="text"
            disabled={!!shortenHistory}
            className={
              'w-full appearance-none overflow-ellipsis border-none bg-transparent px-[3px] leading-tight text-gray-700 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400'
            }
            type="text"
            placeholder="xxx"
            aria-label="Custom hash"
          />
        </div>
      </div>
    </div>
  );
};
