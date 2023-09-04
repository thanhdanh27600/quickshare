import { BrandHead } from './BrandHead';
import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <BrandHead />
      <Header />
      <div className="container-xl mx-auto mb-0 min-h-[80vh] p-4 max-sm:py-8 sm:mb-16 md:mt-8 md:max-w-5xl">
        {children}
      </div>
      <Footer />
    </>
  );
};
