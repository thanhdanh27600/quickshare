import { BrandHead } from './BrandHead';
import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <BrandHead />
      <Header />
      <div className="container-xl mx-auto min-h-[80vh] p-4 max-sm:py-8 md:mt-8 md:max-w-5xl">{children}</div>
      <Footer />
    </>
  );
};
