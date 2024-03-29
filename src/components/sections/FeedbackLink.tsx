import { useTrans } from 'utils/i18next';

export const FeedbackLink = ({ template, displayText }: { template?: FeedbackTemplate; displayText?: string }) => {
  const { t } = useTrans('common');
  const supportUrl = useFeedbackTemplate(template);

  return (
    <div className="mt-4 flex justify-end">
      <a
        href={supportUrl}
        target="_blank"
        className="cursor-pointer underline decoration-1 transition-all hover:text-cyan-500 hover:decoration-wavy">
        {displayText || t('giveFeedback')}
      </a>
    </div>
  );
};

export enum FeedbackTemplate {
  URL_SHORT = 'URL_SHORT',
  URL_TRACKING = 'URL_TRACKING',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  NOTE = 'NOTE',
  UPLOAD = 'UPLOAD',
  REPORT_LINK = 'REPORT_LINK',
}

export const useFeedbackTemplate = (template?: FeedbackTemplate) => {
  const { t } = useTrans('common');
  const email = 'quickshare.at@gmail.com';
  let supportUrl = '';
  switch (template) {
    case FeedbackTemplate.URL_TRACKING:
      supportUrl = `mailto:${email}?subject=${encodeURIComponent(t('feedbackShortSubject'))}&body=${encodeURIComponent(
        t('feedbackBody'),
      )}`;
      break;
    case FeedbackTemplate.NOTE:
      supportUrl = `mailto:${email}?subject=${encodeURIComponent(t('feedbackNoteSubject'))}&body=${encodeURIComponent(
        t('feedbackBody'),
      )}`;
      break;
    case FeedbackTemplate.UPLOAD:
      supportUrl = `mailto:${email}?subject=${encodeURIComponent(t('feedbackUploadSubject'))}&body=${encodeURIComponent(
        t('feedbackBody'),
      )}`;
      break;
    case FeedbackTemplate.FORGOT_PASSWORD:
      supportUrl = `mailto:${email}?subject=${encodeURIComponent(t('feedbackForgotSubject'))}&body=${encodeURIComponent(
        t('feedbackForgotBody'),
      )}`;
      break;
    case FeedbackTemplate.REPORT_LINK:
      supportUrl = `mailto:${email}?subject=${encodeURIComponent(
        t('feedbackReportLinkSubject'),
      )}&body=${encodeURIComponent(t('feedbackReportLinkBody'))}`;
      break;
    case FeedbackTemplate.URL_SHORT:
    default:
      supportUrl = `mailto:${email}?subject=${encodeURIComponent(t('feedbackURLSubject'))}&body=${encodeURIComponent(
        t('feedbackBody'),
      )}`;
      break;
  }
  return supportUrl;
};
