import { Button } from 'components/atoms/Button';
import { BrandHead } from 'components/layouts/BrandHead';
import { Header } from 'components/layouts/Header';

const PageNotFound = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-200 to-purple-200">
      <BrandHead />
      <Header />
      <div className={'container-xl mx-auto mb-0 min-h-[80vh] max-sm:py-8 md:max-w-7xl'}>
        <div className="m-auto min-h-screen w-9/12 sm:mt-16">
          <div className="overflow-hidden bg-white pb-8 shadow sm:rounded-lg">
            <div className="border-t border-gray-200 pt-8 text-center">
              <h1 className="boujee-text text-9xl font-bold">404</h1>
              <h1 className="py-8 text-3xl font-medium sm:text-6xl">Oops! Page not found</h1>
              <p className="px-12 pb-8 text-lg font-medium sm:text-2xl">
                The page you are looking for does not exist. It might have been moved or deleted.
              </p>
              <a href={'/'} className="mr-6">
                <Button text="Home" />
              </a>
              <button className="rounded-md bg-gradient-to-r from-red-400 to-red-500 px-6 py-3 font-semibold text-white hover:from-red-500 hover:to-red-500">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
