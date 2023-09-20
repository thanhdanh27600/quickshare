import { useSession } from 'next-auth/react';
import { brandUrlShortDomain } from 'types/constants';
import { useTrans } from 'utils/i18next';

export const CustomLinkForm = () => {
  const { t } = useTrans();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center text-sm">
      <p className="text-gray-500">
        <span>{t('customLink')}</span> {brandUrlShortDomain}/
      </p>
      <form className="w-full max-w-[8rem] sm:max-w-[12rem]">
        <div className="flex items-center border-b border-cyan-500">
          <input
            className="w-full appearance-none border-none bg-transparent px-1 leading-tight text-gray-700 focus:outline-none"
            type="text"
            placeholder="xxx"
            aria-label="Custom link"
          />
        </div>
      </form>
    </div>
  );
};
