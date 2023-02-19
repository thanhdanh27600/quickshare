import { Header } from 'components/layouts/Header';
import { URLShortener } from 'components/screens/URLShortener';
import Head from 'next/head';
import { BASE_URL } from 'types/constants';

const Home = () => {
  return (
    <>
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://facebook.com/clickditop/ " />
        <meta property="og:title" content="Clickdi - Share link like a pro." />
        <meta
          property="og:description"
          content="Clickdi is more than a URL shortener, help you track the usage of the shortened URLs, providing analytics on the number of clicks, geographic location of clicks, and other relevant data. Take action on the effectiveness of shared links and make data-driven decisions to improve their outreach efforts."
        />
        <meta
          property="og:image"
          content={BASE_URL + '/api/og' + encodeURI('?title=Let us Shorten your URL, always free')}
        />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://twitter.com/clickditop" />
        <meta property="twitter:title" content="Clickdi - Share link like a pro." />
        <meta
          property="twitter:description"
          content="Clickdi is more than a URL shortener, help you track the usage of the shortened URLs, providing analytics on the number of clicks, geographic location of clicks, and other relevant data. Take action on the effectiveness of shared links and make data-driven decisions to improve their outreach efforts."
        />
        <meta
          property="twitter:image"
          content={BASE_URL + '/api/og' + encodeURI('?title=Let us Shorten your URL, always free')}
        />
      </Head>
      <Header />
      <div className="container mt-4 px-2 md:mx-auto md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </>
  );
};

export default Home;
