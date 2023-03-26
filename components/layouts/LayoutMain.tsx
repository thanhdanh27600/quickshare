import { Footer } from './Footer';
import { Header } from './Header';

export const LayoutMain = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
