import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AreaItemProps } from './types';

const AreaItem: React.FC<AreaItemProps> = ({ area, windowWidth }) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  const statusClass =
    area.status === 'active'
      ? 'bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark'
      : area.status === 'inactive'
        ? 'bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark'
        : 'bg-border dark:bg-border-dark text-textSecondary dark:text-textSecondary-dark';

  const dotClass =
    area.status === 'active'
      ? 'bg-success dark:bg-success-dark'
      : area.status === 'inactive'
        ? 'bg-danger dark:bg-danger-dark'
        : 'bg-textMuted dark:bg-textMuted-dark';

  return (
    <Link
      to={`/areas/${area.id}`}
      className="block p-4 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm mb-3 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`flex justify-between ${isMobile ? 'flex-col items-start gap-3' : 'flex-row items-center'}`}>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-info dark:text-info-dark truncate m-0 mb-2">
            {area.name}
          </p>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {area.organizationId && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-infoBg dark:bg-infoBg-dark text-infoText dark:text-infoText-dark inline-block">
                {area.organization?.name || t('organization')}
              </span>
            )}
          </div>
          <p className="text-sm text-textMuted dark:text-textMuted-dark m-0 truncate">
            {area.description || t('areas.noDescription')}
          </p>
        </div>
        <div className={`flex-shrink-0 ${isMobile ? 'mt-0' : 'ml-4'}`}>
          <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${statusClass}`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${dotClass}`} />
            {t(area.status)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AreaItem;
