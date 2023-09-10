import clsx from 'clsx';
import { FeatureTabs } from 'components/gadgets/FeatureTabs';
import { BrandHead } from './BrandHead';
import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="bg-gray-50/50">
      <BrandHead />
      <Header />
      <div className={clsx('container-xl mx-auto mb-0 min-h-[80vh] p-4 max-sm:py-8 sm:mb-16 md:max-w-7xl')}>
        <div className={'mb-8'}>
          <FeatureTabs />
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
};
