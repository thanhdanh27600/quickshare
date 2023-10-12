import { i18n } from 'next-i18next';
import { createTransport, Transporter } from 'nodemailer';
import { Locale, locales } from '../types/locale';
import { defaultLocale } from './i18next';

interface Theme {
  brandColor?: string;
  buttonText?: string;
}

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: {
    server: any;
    from: string;
  };
  theme: Theme;
}) {
  const { identifier, url, provider, theme } = params;
  const { host, searchParams } = new URL(url);
  const callbackUrl = searchParams.get('callbackUrl');

  let locale = defaultLocale;
  try {
    locale = callbackUrl ? (new URL(callbackUrl).pathname.split('/')[1] as Locale) : defaultLocale;
    if (!locales[locale]) locale = defaultLocale;
  } catch (error) {
    console.error(error);
  }

  const t = (await i18n?.init({ lng: locale, ns: ['common'] })) || function (...any: any[]) {};

  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport: Transporter = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `${t('signInTo')} ${host}`,
    text: text({ url, host, t }),
    html: html({ url, host, theme, t }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme; t: any }): string {
  const { url, host, theme, t } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = theme.brandColor || '#346df1';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  };

  return `
<body style="background: ${color.background}; padding: 50px;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        ${t('signInTo')} <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${
                  color.buttonText
                }; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid; border-color: ${
    color.buttonBorder
  }; display: inline-block; font-weight: bold;">${t('continue')}</a></td>
          </tr>
          <tr>
          <td style="padding-top:8px">
          <a style="color:#9370db; word-break: break-all;cursor: pointer;" href="${url}">${t('signInLink')}</a>
          </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${
          color.text
        };">
        ${t('emailSignInWarning')}
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text(params: { url: string; host: string; t: any }): string {
  return `${params.t('signInTo')} ${params.host}\n${params.url}\n\n`;
}
