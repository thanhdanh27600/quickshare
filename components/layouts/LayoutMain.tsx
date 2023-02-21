import { BrandHead } from './BrandHead';
import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <BrandHead />
      <Header />
      {children}
      <Footer />
    </>
  );
};
