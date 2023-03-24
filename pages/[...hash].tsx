import { getForwardUrl } from 'api/requests';
import CryptoJS from 'crypto-js';
import mixpanel from 'mixpanel-browser';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import requestIp from 'request-ip';
import { BASE_URL_SHORT, brandUrlShortDomain, isProduction, PLATFORM_AUTH, Window } from 'types/constants';
import { MIXPANEL_EVENT, MIXPANEL_STATUS } from 'types/utils';
import { useTrans } from 'utils/i18next';

interface Props {
  url: string;
  hash: string;
  error?: unknown;
  ip?: string;
  redirect?: string;
}

const ForwardURL = ({ url, hash, ip, error, redirect }: Props) => {
  const forwardUrl = useMutation('forward', getForwardUrl);
  const loading = forwardUrl.isLoading && !forwardUrl.isError;

  useEffect(() => {
    if (!Window()) {
      return;
    }
    if (redirect) {
      location.replace(redirect);
      return;
    } else {
      // start client-side forward
      forwardUrl.mutate({
        hash: hash,
        userAgent: navigator.userAgent,
        ip,
        fromClientSide: true,
      });
    }
  }, []);

  const { t } = useTrans();
  useEffect(() => {
    if (!Window()) {
      return;
    }
    if (forwardUrl.isIdle) return;
    if (loading) return;
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

  let encodeTitle = '';
  if (PLATFORM_AUTH) {
    encodeTitle = CryptoJS.AES.encrypt(`Shared Link <${hash}>. Click Now!`, PLATFORM_AUTH).toString();
  }

  return (
    <>
      {/* CUSTOM HEAD */}
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://facebook.com/clickditop/ " />
        <meta property="og:title" content={`I'm sharing link <${hash}> with you. Let's explore!`} />
        <meta property="og:image" content={`${BASE_URL_SHORT}/api/og?title=${encodeURIComponent(encodeTitle)}`} />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://twitter.com/clickditop" />
        <meta property="twitter:title" content={`I'm sharing link <${hash}> with you. Let's explore!`} />
        <meta property="twitter:image" content={`${BASE_URL_SHORT}/api/og?title=${encodeURIComponent(encodeTitle)}`} />
      </Head>
      {error ? <p>{t(error as any)}</p> : <></>}
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    if (isProduction && context.req.headers['host'] !== brandUrlShortDomain) {
      return {
        props: { redirect: '/' },
      };
    }
    const { hash } = context.query;
    const ip = requestIp.getClientIp(context.req);
    // start server-side forward
    const forwardUrl = await getForwardUrl({
      hash: hash ? (hash[0] as string) : '',
      userAgent: context.req.headers['user-agent'],
      ip,
    });
    return { props: { url: forwardUrl.history?.url, hash: hash ? (hash[0] as string) : '', ip } };
  } catch (error: any) {
    console.error('ForwardURL error', error);
    return { props: { error: error.message || 'somethingWrong' } };
  }
}

export default ForwardURL;
