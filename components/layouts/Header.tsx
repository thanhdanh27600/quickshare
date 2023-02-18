import { BrandIconText, BrandLogo } from 'components/atoms/BrandIcon';

export const Header = () => {
  return (
    <div className="md:max-w-7x container flex justify-between py-5 px-2 md:mx-auto">
      <div className="flex w-fit flex-col items-center gap-2">
        <BrandLogo
          width={50}
          className="-ml-4 bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent"
        />
        <BrandIconText width={120} />
      </div>
      <div className="flex items-center">
        <a className="cursor-pointer transition-all hover:text-cyan-500 hover:underline">Báo cáo lỗi</a>
      </div>
    </div>
  );
};
