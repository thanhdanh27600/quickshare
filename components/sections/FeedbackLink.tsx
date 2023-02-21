import { useTrans } from 'utils/i18next';

export const FeedbackLink = ({ template, displayText }: { template: FeedbackTemplate; displayText?: string }) => {
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
}

const useFeedbackTemplate = (template: FeedbackTemplate) => {
  const { t } = useTrans('common');
  let supportUrl = '';
  switch (template) {
    case FeedbackTemplate.URL_SHORT:
      supportUrl = `mailto:thanhdanh27600@gmail.com?subject=${encodeURIComponent(
        t('feedbackURLSubject'),
      )}&body=${encodeURIComponent(t('feedbackBody'))}`;
      break;
    case FeedbackTemplate.URL_TRACKING:
      supportUrl = `mailto:thanhdanh27600@gmail.com?subject=${encodeURIComponent(
        t('feedbackShortSubject'),
      )}&body=${encodeURIComponent(t('feedbackBody'))}`;
      break;
    case FeedbackTemplate.FORGOT_PASSWORD:
      supportUrl = `mailto:thanhdanh27600@gmail.com?subject=${encodeURIComponent(
        t('feedbackForgotSubject'),
      )}&body=${encodeURIComponent(t('feedbackForgotBody'))}`;
      break;
    default:
      break;
  }
  return supportUrl;
};
