import { Header } from 'components/layouts/Header';
import { URLShortener } from 'components/screens/URLShortener';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { isProduction } from 'types/constants';
import { LocaleProp } from 'types/locale';

const Home = () => {
  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content="Clickdi - Share link like a pro." />
        <meta
          name="description"
          content="Clickdi is more than a URL shortener, help you track the usage of the shortened URLs, providing analytics on the number of clicks, geographic location of clicks, and other relevant data. Take action on the effectiveness of shared links and make data-driven decisions to improve their outreach efforts."
        />

        {isProduction && <title>Clickdi - Share link like a pro.</title>}
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
          content={
            '/api/og?title=' +
            encodeURIComponent(
              'U2FsdGVkX1+IEpdIZm+U48yjdQMVqcCOVBw2TQjQriMnsP0paNBd7TqAWmeqTJScL0trSU9MdKZEysQO5YkJXw==',
            )
          }
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
          content={
            '/api/og?title=' +
            encodeURIComponent(
              'U2FsdGVkX1+IEpdIZm+U48yjdQMVqcCOVBw2TQjQriMnsP0paNBd7TqAWmeqTJScL0trSU9MdKZEysQO5YkJXw==',
            )
          }
        />
      </Head>
      <Header />
      <div className="container-xl mx-auto p-4 md:mt-8 md:max-w-5xl">
        <URLShortener />
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async ({ locale }: LocaleProp) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'vi', ['common'])),
  },
});
