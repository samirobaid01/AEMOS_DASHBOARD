import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button/Button';
import type { AreaDetailsProps } from './types';

const AreaDetails: React.FC<AreaDetailsProps> = ({
  area,
  isLoading,
  error,
  onEdit,
  onDelete,
  onBack,
  windowWidth
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-textMuted dark:text-textMuted-dark">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg mb-4 bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark">
        {error}
      </div>
    );
  }

  if (!area) {
    return null;
  }

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
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      <div className="max-w-[65rem] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={onBack}>
            {t('common.back')}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onEdit}>
              {t('common.edit')}
            </Button>
            <Button variant="danger" onClick={onDelete}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark mt-0 mb-6">
              {area.name}
            </h1>
            <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div>
                <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-4">
                  {t('areas.description')}
                </h2>
                <div className="mb-4">
                  <p className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1 m-0">
                    {t('common.organizations')}
                  </p>
                  <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
                    {area.organization?.name || '-'}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1 m-0">
                    {t('status')}
                  </p>
                  <p className="text-base m-0">
                    <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${statusClass}`}>
                      <span className={`w-2 h-2 rounded-full mr-1.5 ${dotClass}`} />
                      {t(area.status)}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark m-0 mb-4">
                  {t('areas.additionalDetails')}
                </h2>
                <div className="mb-4">
                  <p className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1 m-0">
                    {t('common.description')}
                  </p>
                  <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0 leading-relaxed">
                    {area.description || t('areas.noDescription')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-textMuted dark:text-textMuted-dark mb-1 m-0">
                    {t('areas.created_at')}
                  </p>
                  <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
                    {area.createdAt ? new Date(area.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetails;
