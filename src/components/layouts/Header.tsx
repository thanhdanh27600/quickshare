import { BrandLogo, BrandText } from 'components/atoms/BrandIcon';
import Link from 'next/link';

export const Header = () => {
  return (
    <div className="mx-auto flex justify-between px-4 py-5 sm:w-full md:mx-auto md:max-w-7xl">
      <Link
        href="/"
        onClick={() => {
          location.href = '/';
        }}>
        <div className="flex w-fit cursor-pointer flex-col items-center gap-2">
          <BrandLogo
            width={38}
            className="-ml-4 bg-gradient-to-br from-cyan-500 to-purple-500 bg-clip-text text-transparent"
          />
          <BrandText width={148} />
        </div>
      </Link>
    </div>
  );
};
