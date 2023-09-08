import clsx from 'clsx';
import { FeatureTabs } from 'components/gadgets/FeatureTabs';
import { BrandHead } from './BrandHead';
import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({ children, size = 'compact' }: React.PropsWithChildren & { size?: 'compact' | 'full' }) => {
  return (
    <>
      <BrandHead />
      <Header />
      <div
        className={clsx(
          'container-xl mx-auto mb-0 min-h-[80vh] p-4 max-sm:py-8 sm:mb-16',
          size === 'compact' ? 'md:max-w-5xl' : 'md:max-w-7xl',
        )}>
        <div className={'mb-4'}>
          <FeatureTabs />
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
};
