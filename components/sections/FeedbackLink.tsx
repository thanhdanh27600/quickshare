import { useTrans } from 'utils/i18next';

export const FeedbackLink = ({ template }: { template: FeedbackTemplate }) => {
  const { t } = useTrans('common');
  const supportUrl = useFeedbackTemplate(template);

  return (
    <div className="mt-4 flex justify-end">
      <a
        href={supportUrl}
        target="_blank"
        className="cursor-pointer underline decoration-1 transition-all hover:text-cyan-500 hover:decoration-wavy">
        {t('giveFeedback')}
      </a>
    </div>
  );
};

export enum FeedbackTemplate {
  URL_SHORT = 'URL_SHORT',
  URL_TRACKING = 'URL_TRACKING',
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
    default:
      break;
  }
  return supportUrl;
};
