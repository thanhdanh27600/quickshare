import { BrandIconText, BrandLogo } from 'components/atoms/BrandIcon';
import { LanguageSelect } from 'components/gadgets/LanguageSelect';
import Link from 'next/link';

export const Header = () => {
  return (
    <div className="container flex justify-between py-5 px-4 md:mx-auto md:max-w-7xl">
      <Link href="/">
        <div className="flex w-fit cursor-pointer flex-col items-center gap-2">
          <BrandLogo
            width={50}
            className="-ml-4 bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent"
          />
          <BrandIconText width={80} />
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSelect />
      </div>
    </div>
  );
};
