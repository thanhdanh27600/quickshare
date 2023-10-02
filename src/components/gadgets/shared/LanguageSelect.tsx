import clsx from 'clsx';
import { ChinaIcon } from 'components/icons/ChinaIcon';
import { DropdownIndicate } from 'components/icons/DropdownIndicate';
import { FranceIcon } from 'components/icons/FranceIcon';
import { IndiaIcon } from 'components/icons/IndiaIcon';
import { JapanIcon } from 'components/icons/JapanIcon';
import { UsaIcon } from 'components/icons/UsaIcon';
import { VietnamIcon } from 'components/icons/VietnamIcon';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { languages, Locale } from 'types/locale';
import { useTrans } from 'utils/i18next';

const LangugageIcon: Record<Locale, (props: any) => JSX.Element> = {
  vi: VietnamIcon,
  en: UsaIcon,
  fr: FranceIcon,
  zh: ChinaIcon,
  ja: JapanIcon,
  hi: IndiaIcon,
};

const LanguageOptions = ({ changeLanguage, setOpen }: { changeLanguage: (l: string) => void; setOpen: any }) => (
  <>
    {Object.keys(LangugageIcon).map((lan) => {
      const Icon = LangugageIcon[lan as Locale];
      return (
        <li className="ml-0 list-none" key={lan}>
          <button
            onClick={() => {
              changeLanguage(lan);
              setOpen(false);
            }}
            type="button"
            className="inline-flex w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
            <div className="inline-flex items-center">
              <Icon width={20} className="mr-2" />
              {languages[lan as Locale]}
            </div>
          </button>
        </li>
      );
    })}
  </>
);

export const LanguageSelect = () => {
  const router = useRouter();
  const { locale } = useTrans();
  const [open, setOpen] = useState(false);

  if (!locale) return null;

  const Icon = LangugageIcon[locale];

  const changeLanguage = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="flex">
      <button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="z-10 inline-flex w-20 flex-shrink-0 items-center rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 md:w-40"
        type="button">
        <div className="flex w-full items-center gap-2">
          <Icon className="h-4" />
          <span className="hidden md:block">{languages[locale]}</span>
        </div>
        <DropdownIndicate />
      </button>
      <div
        className={clsx(
          'absolute inset-x-auto z-10 m-0 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow-xl',
          open && '!block translate-x-[-50%] translate-y-[-110%] md:translate-x-[-10%]',
        )}>
        <ul className="text-sm text-gray-900" aria-labelledby="states-button">
          <LanguageOptions changeLanguage={changeLanguage} setOpen={setOpen} />
        </ul>
      </div>
    </div>
  );
};
