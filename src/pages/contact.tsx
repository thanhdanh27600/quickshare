import { LayoutMain } from 'components/layouts/LayoutMain';
import mixpanel from 'mixpanel-browser';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect } from 'react';
import { LocaleProp } from 'types/locale';
import { MIXPANEL_EVENT } from 'types/utils';
import { defaultLocale } from 'utils/i18next';

const Contact = () => {
  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.CONTACT);
  }, []);

  return (
    <LayoutMain featureTab={false}>
      <Head>
        <title>Contact to Quickshare</title>
        <meta name="title" content={`Contact to Quickshare`} />
        <meta
          name="description"
          content={`For any further questions or inquiries, you can reach out to the maintainers of this project:\nMaintainer Name: Dolph Pham\nMaintainer Email: dolph.pham@gmail.com`}
        />
      </Head>
      <h1 className="mt-8 text-4xl font-bold">{'Contact'}</h1>
      <div className="mx-auto mt-8 max-w-7xl rounded-lg bg-gray-100 p-8 text-xl">
        <p>For any further questions or inquiries, you can reach out to the maintainers of this project:</p>
        <ul className="mt-4 max-w-md list-inside list-disc space-y-1 text-gray-900">
          <li>Maintainer Name: Dolph Pham</li>
          <li>
            Maintainer Email:{' '}
            <a target="_blank" className="text-cyan-500" href="mailto:dolph.pham@gmail.com">
              dolph.pham@gmail.com
            </a>
          </li>
        </ul>
        <p className="mt-4">If you read this. Thank you and take care.</p>
      </div>
    </LayoutMain>
  );
};

export const getServerSideProps = async ({ locale }: LocaleProp) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? defaultLocale, ['common'])),
    },
  };
};

export default Contact;
