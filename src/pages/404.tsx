import { Button } from 'components/atoms/Button';
import { BrandHead } from 'components/layouts/BrandHead';
import { Footer } from 'components/layouts/Footer';
import { Header } from 'components/layouts/Header';

const PageNotFound = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-200 to-purple-200">
      <BrandHead />
      <Header />
      <div className={'container-xl mx-auto mb-0 min-h-[80vh] max-sm:py-8 md:max-w-7xl'}>
        <div className="m-auto min-h-screen w-9/12 sm:mt-16">
          <div className="overflow-hidden bg-gray-50 pb-8 shadow sm:rounded-lg">
            <div className="border-t border-gray-200 pt-8 text-center">
              <h1 className="boujee-text text-9xl font-bold">404</h1>
              <h1 className="py-8 text-2xl font-medium sm:text-6xl">Oops! Page not found</h1>
              <p className="px-12 pb-8 font-medium sm:text-2xl">
                The page you are looking for does not exist. It might have been moved or deleted.
              </p>
              <a href={'/'} className="mr-6">
                <Button text="Home" />
              </a>
              <a href={'/contact'} className="mr-6">
                <Button text="Contact" className="from-red-500 to-red-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer className="bg-gray-50" />
    </div>
  );
};

export default PageNotFound;
