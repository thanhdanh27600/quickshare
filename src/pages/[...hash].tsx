import { UrlShortenerHistory } from '@prisma/client';
import { getForwardUrl } from 'api/requests';
import mixpanel from 'mixpanel-browser';
import { GetServerSidePropsContext } from 'next';
import { CldOgImage } from 'next-cloudinary';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { stringify } from 'querystring';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import requestIp from 'request-ip';
import { BASE_URL_OG, brandUrlShortDomain, isProduction, Window } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { encodeBase64 } from 'utils/crypto';
import { defaultLocale, useTrans } from 'utils/i18next';
import { QueryKey } from 'utils/requests';
import PageNotFound from './404';

interface Props {
  history?: UrlShortenerHistory | null;
  hash: string;
  error?: unknown;
  ip?: string;
  redirect?: string;
}

const ForwardURL = ({ history, hash, ip, error, redirect }: Props) => {
  const { t, locale } = useTrans();
  const forwardUrl = useMutation(QueryKey.FORWARD, getForwardUrl);
  const loading = forwardUrl.isLoading && !forwardUrl.isError;
  const url = history?.url;
  const theme = history?.theme;
  const ogTitle = history?.ogTitle || t('ogTitle', { hash });
  const ogDescription = history?.ogDescription || t('ogDescription');
  const ogImgSrc = history?.ogImgSrc;

  useEffect(() => {
    if (!Window()) {
      return;
    }
    if (redirect) {
      location.replace(redirect);
    } else {
      // start client-side forward
      forwardUrl.mutate({
        locale,
        hash: hash,
        userAgent: navigator.userAgent,
        ip,
        fromClientSide: true,
      });
    }
  }, []);

  useEffect(() => {
    if (!Window()) {
      return;
    }
    if (forwardUrl.isIdle) {
      return;
    }
    if (loading) {
      return;
    }
    if (!url) {
      mixpanel.track(MIXPANEL_EVENT.FORWARD, {
        status: MIXPANEL_STATUS.FAILED,
        error,
      });
      if (forwardUrl.isSuccess) {
        location.replace('/');
      } else {
        console.error('Cannot forward...!');
      }
      return;
    }
    mixpanel.track(MIXPANEL_EVENT.FORWARD, {
      status: MIXPANEL_STATUS.OK,
      urlRaw: url,
      hash,
    });
    location.replace(`${url.includes('http') ? '' : '//'}${url}`);
  }, [forwardUrl]);

  const encodeTitle = encodeBase64(ogTitle);

  if (!!error) return <PageNotFound />;

  return (
    <>
      {/* CUSTOM HEAD */}
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://facebook.com/clickditop/ " />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        {/* <meta property="twitter:url" content="https://twitter.com/clickditop" /> */}
        <meta property="twitter:title" content={ogTitle} />
        <meta property="twitter:description" content={ogDescription} />
        {!ogImgSrc && (
          <>
            <meta
              property="og:image"
              content={`${BASE_URL_OG}/api/og?${stringify({ hash, theme, title: encodeTitle })}`}
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="627" />
            <meta property="og:image:alt" content={t('ogDescription')} />
            <meta
              property="twitter:image"
              content={`${BASE_URL_OG}/api/og?${stringify({ hash, theme, title: encodeTitle })}`}
            />
            <meta name="twitter:image:alt" content={t('ogDescription')}></meta>
            <meta property="twitter:card" content="summary_large_image" />
          </>
        )}
      </Head>
      {ogImgSrc && <CldOgImage alt={t('ogDescription')} src={ogImgSrc} />}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    if (isProduction && context.req.headers?.host !== brandUrlShortDomain) {
      return {
        props: { redirect: '/' },
      };
    }
    const locale = context.locale || defaultLocale;
    const { hash } = context.query;
    const ip = requestIp.getClientIp(context.req);
    // start server-side forward
    const forwardUrl = await getForwardUrl({
      locale,
      hash: hash ? (hash[0] as string) : '',
      userAgent: context.req.headers['user-agent'],
      ip,
    });
    return {
      props: {
        history: forwardUrl.history,
        hash: hash ? (hash[0] as string) : '',
        ip,
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  } catch (error: any) {
    console.error('ForwardURL error', error);
    return { props: { error: error.message || 'somethingWrong' } };
  }
}

// export default pgShortDomain(ForwardURL);
export default ForwardURL;
