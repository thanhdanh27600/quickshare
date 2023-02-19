import { BrandIconText, BrandLogo } from 'components/atoms/BrandIcon';
import { BASE_URL } from 'types/constants';

export const Header = () => {
  const supportUrl = `mailto:thanhdanh27600@gmail.com?subject=${encodeURIComponent(
    '[CLICKDI.TOP] Hỗ trợ / Báo lỗi',
  )}&body=${encodeURIComponent('Rất tiếc không làm bạn hài lòng, hãy cung cấp thêm thông tin nhé:\n')}`;

  return (
    <div className="container flex justify-between py-5 px-2 md:mx-auto md:max-w-7xl">
      <div className="flex w-fit flex-col items-center gap-2">
        <BrandLogo
          width={50}
          className="-ml-4 bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent"
        />
        <BrandIconText width={120} />
      </div>
      <div className="flex items-center">
        <a
          href={supportUrl}
          target="_blank"
          rel={BASE_URL}
          className="cursor-pointer transition-all hover:text-cyan-500 hover:underline">
          Báo cáo lỗi
        </a>
      </div>
    </div>
  );
};
