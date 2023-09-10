import { BrandText } from 'components/atoms/BrandIcon';
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
          <BrandText width={148} />
        </div>
      </Link>
    </div>
  );
};
