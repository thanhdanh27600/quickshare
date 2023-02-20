import { BASE_URL } from 'types/constants';
import { useTrans } from 'utils/i18next';

export const FeedbackLink = () => {
  const { t } = useTrans('common');

  const supportUrl = `mailto:thanhdanh27600@gmail.com?subject=${encodeURIComponent(
    t('feedbackSubject'),
  )}&body=${encodeURIComponent(t('feedbackBody'))}`;

  return (
    <div className="mt-4 flex justify-end">
      <a
        href={supportUrl}
        target="_blank"
        rel={BASE_URL}
        className="cursor-pointer underline transition-all hover:text-cyan-500 hover:decoration-wavy">
        {t('giveFeedback')}
      </a>
    </div>
  );
};
