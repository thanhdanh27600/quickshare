import { LayoutMain } from 'components/layouts/LayoutMain';
import mixpanel from 'mixpanel-browser';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect } from 'react';
import { LocaleProp } from 'types/locale';
import { MIXPANEL_EVENT } from 'types/utils';
import { defaultLocale } from 'utils/i18next';

const Terms = () => {
  useEffect(() => {
    mixpanel.track(MIXPANEL_EVENT.TERMS);
  }, []);

  return (
    <LayoutMain featureTab={false}>
      <Head>
        <title>Quickshare&apos;s Terms and Conditions of Use</title>
        <meta name="title" content={"Quickshare's Terms and Conditions of Use"} />
      </Head>
      <section className="common">
        <h1>Terms and Conditions of Use</h1>
        <p className="my-2">Last updated: September 29, 2023</p>
        <p>
          The Terms of Service outline the guidelines governing access to and utilization of Quickshare, encompassing
          all content, features, and services provided by the Site, regardless of whether you are a guest or a
          registered user. We strongly advise you to thoroughly review the Terms of Service before commencing your use
          of the Site. This page elucidates the conditions governing the usage of Quickshare, and by using the Site, you
          implicitly agree to abide by these terms. Quickshare is a convenient service that condenses links from
          websites, blogs, forums, or social networks into shortened links for easy sharing across various platforms.
        </p>
        <h2>Conditions of Use</h2>
        In order to provide a free and secure service, it is necessary to agree to the conditions of use when using our
        services.
        <ul>
          <li>Shortened URLs that do not have at least one click per month are disabled</li>
        </ul>
        Shortened URL is available for users of all countries and of any age, therefore it is not allowed to create
        shortened URLs that redirect to:
        <ul>
          <li>Content that spreads phishing, malware or viruses</li>
          <li> Abusive or suspicious content Pornographic or sexual content Violent or prejudiced content</li>
          <li>Content related to drugs, weapons or alcohol</li>
          <li>Content that may infringe other people&apos;s rights</li>
          <li>Disgusting, explicit or offensive content that causes any kind of discomfort to users</li>
          <li>Pop-ups, scripts and malicious code</li>
          <li>Double redirection</li>
        </ul>
        <h2>Content Monitoring</h2>
        <p>
          We take the responsibility of monitoring the content of shortened URLs seriously. Our team regularly reviews
          all URLs created on our platform. If we receive reports of spam or notice any abusive behavior that violates
          our terms of service, we reserve the right to take appropriate action, including disabling the shortened URL,
          without prior notice.
        </p>
        <h2>Request for Updates or Corrections</h2>
        <p>
          If you need to request an update or correction for a shortened URL that you have created, please use our
          contact form to inform us of the long URL and the short URL. Our team will review your request and determine
          if it is possible to make the requested changes to your shortened URL. Thank you for choosing our service. By
          using our platform, you agree to comply with these terms and conditions. If you have any questions or
          concerns, please don&apos;t hesitate to contact us.
        </p>
        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on Quickshare&apos;s Website for
          personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
          under this license you may not:
        </p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose or for any public display;</li>
          <li>attempt to reverse engineer any software contained on Quickshare&apos;s Website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transferring the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
        </ul>
        <h2>Disclaimer</h2>
        <p>
          All the materials on Quickshare&apos;s Website are provided &quot;as is&quot;. Quickshare makes no warranties,
          may it be expressed or implied, therefore negates all other warranties. Furthermore, Quickshare does not make
          any representations concerning the accuracy or reliability of the use of the materials on its Website or
          otherwise relating to such materials or any sites linked to this Website.
        </p>
        <h2>Limitations</h2>
        <p>
          Quickshare or its suppliers will not be hold accountable for any damages that will arise with the use or
          inability to use the materials on Quickshare&apos;s Website, even if Quickshare or an authorize representative
          of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction
          does not allow limitations on implied warranties or limitations of liability for incidental damages, these
          limitations may not apply to you.
        </p>
        <h2>Revisions and Errata</h2>
        <p>
          The materials appearing on Quickshare&apos;s Website may include technical, typographical, or photographic
          errors. Quickshare will not promise that any of the materials in this Website are accurate, complete, or
          current. Quickshare may change the materials contained on its Website at any time without notice. Quickshare
          does not make any commitment to update the materials.
        </p>
        <h2>Links</h2>
        <p>
          Quickshare has not reviewed all of the sites linked to its Website and is not responsible for the contents of
          any such linked site. The presence of any link does not imply endorsement by Quickshare of the site. The use
          of any linked website is at the user&apos;s own risk.
        </p>
        <h2>Site Terms of Use Modifications</h2>
        <p>
          Quickshare may revise these Terms of Use for its Website at any time without prior notice. By using this
          Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
        </p>
        <h2>Your Privacy</h2>
        <p>Please read our Privacy Policy.</p>
        <h2>Governing Law</h2>
        <p>
          Any claim related to Quickshare&apos;s Website shall be governed by the laws of Vietnam without regards to its
          conflict of law provisions.
        </p>
      </section>
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

export default Terms;
