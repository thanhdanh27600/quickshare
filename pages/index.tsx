import { Header } from 'components/layouts/Header';
import { URLShortener } from 'components/screens/URLShortener';

const Home = () => {
  return (
    <>
      <Header />
      <div className="container mt-4 px-2 md:mx-auto md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </>
  );
};

export default Home;
