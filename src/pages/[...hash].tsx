'use client';

import { UrlShortenerHistory } from '@prisma/client';
import { logEvent } from 'firebase/analytics';
import mixpanel from 'mixpanel-browser';
import { GetServerSidePropsContext } from 'next';
import { CldOgImage } from 'next-cloudinary';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { stringify } from 'querystring';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import requestIp from 'request-ip';
import { getForwardUrl } from 'requests';
import { BASE_URL_OG, Window, isProduction } from 'types/constants';
import { EVENTS_STATUS, FIREBASE_ANALYTICS_EVENT, MIXPANEL_EVENT } from 'types/utils';
import { encodeBase64 } from 'utils/crypto';
import { analytics } from 'utils/firebase';
import { defaultLocale, useTrans } from 'utils/i18next';
import { QueryKey } from 'utils/requests';
import PageNotFound from './404';

interface Props {
  history: UrlShortenerHistory;
  error?: unknown;
  ip: string;
}

const ForwardURL = ({ history, ip, error }: Props) => {
  const { t } = useTrans();
  const forwardUrl = useMutation(QueryKey.FORWARD, getForwardUrl);
  const loading = forwardUrl.isLoading && !forwardUrl.isError;

  const hash = history?.hash;
  const url = history?.url;
  const theme = history?.theme;
  const ogTitle = history?.ogTitle || t('ogTitle', { hash });
  const ogDescription = history?.ogDescription || t('ogDescription');
  const ogImgSrc = history?.ogImgSrc;
  const useCldImg = ogImgSrc && history?.ogImgPublicId;

  useEffect(() => {
    if (!Window()) {
      return;
    }
    // start client-side forward
    setTimeout(
      () => {
        forwardUrl.mutate({
          hash: hash,
          userAgent: navigator.userAgent,
          ip,
          fromClientSide: true,
        });
      },
      isProduction ? 0 : 2000,
    );
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
      const log = {
        status: EVENTS_STATUS.FAILED,
        error,
      };
      mixpanel.track(MIXPANEL_EVENT.FORWARD, log);
      logEvent(analytics, FIREBASE_ANALYTICS_EVENT.FORWARD, log);
      return;
    }
    mixpanel.track(MIXPANEL_EVENT.FORWARD, {
      status: EVENTS_STATUS.OK,
      urlRaw: url,
      hash,
    });
    location.replace(`${url.includes('http') ? '' : '//'}${url}`);
  }, [forwardUrl]);

  const encodeTitle = encodeBase64(ogTitle);

  if (!history || !history?.hash || !!error) return <PageNotFound />;

  return (
    <>
      {/* CUSTOM HEAD */}
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
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
      {useCldImg && <CldOgImage alt={t('ogDescription')} src={ogImgSrc} />}
      {!useCldImg && ogImgSrc && <meta property="og:image" content={ogImgSrc} />}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const locale = context.locale || defaultLocale;
    const { hash } = context.query;
    const ip = requestIp.getClientIp(context.req) || '';
    const userAgent = context.req.headers['user-agent'] || 'Unknown';
    // start server-side forward
    const forwardUrl = await getForwardUrl({
      hash: hash ? (hash[0] as string) : '',
      userAgent,
      ip,
      fromClientSide: false,
    });

    if (!forwardUrl.history) throw new Error('Cannot found history to forward');

    return {
      props: {
        history: forwardUrl.history,
        ip,
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  } catch (error: any) {
    return {
      props: { error: error.message || 'somethingWrong', ...(await serverSideTranslations(defaultLocale, ['common'])) },
    };
  }
}

export default ForwardURL;
