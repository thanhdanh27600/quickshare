import { FeatureTabKey } from 'bear/utilitySlice';
import clsx from 'clsx';
import { FeatureTabs } from 'components/gadgets/FeatureTabs';
import { BrandHead } from './BrandHead';
import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({
  children,
  feature = FeatureTabKey.SHARE_LINK,
  featureTab = true,
}: React.PropsWithChildren & { feature?: FeatureTabKey; featureTab?: boolean }) => {
  return (
    <div className="bg-gray-50/50">
      <BrandHead feature={feature} />
      <Header />
      <div className={clsx('container-xl mx-auto mb-0 min-h-[80vh] p-4 !pt-0 max-sm:py-8 sm:mb-16 md:max-w-7xl')}>
        {featureTab && (
          <div className={'mb-8'}>
            <FeatureTabs />
          </div>
        )}
        {children}
      </div>
      <Footer />
    </div>
  );
};
