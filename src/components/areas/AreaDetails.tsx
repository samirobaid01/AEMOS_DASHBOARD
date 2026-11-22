import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Pencil, Trash2, Map } from 'lucide-react';
import Button from '../common/Button/Button';
import type { AreaDetailsProps } from './types';

const AreaDetails: React.FC<AreaDetailsProps> = ({
  area,
  isLoading,
  error,
  onEdit,
  onDelete,
  onBack,
}) => {
  const { t } = useTranslation();

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
        : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300';

  const dotClass =
    area.status === 'active'
      ? 'bg-success dark:bg-success-dark'
      : area.status === 'inactive'
        ? 'bg-danger dark:bg-danger-dark'
        : 'bg-textMuted dark:bg-textMuted-dark';

  return (
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="self-start"
        >
          {t('common.back')}
        </Button>

        <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
              <Map className="w-6 h-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0 truncate">
                {area.name}
              </h1>
              <div className="flex items-center flex-wrap gap-2 mt-1.5">
                {area.organizationId && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-leaf-50 dark:bg-leaf-900/40 text-leaf-700 dark:text-leaf-300">
                    {area.organization?.name || t('organization')}
                  </span>
                )}
                <span className={`inline-flex items-center py-0.5 px-2 rounded-full text-xs font-medium ${statusClass}`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${dotClass}`} />
                  {t(area.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button type="button" variant="primary" onClick={onEdit} leftIcon={<Pencil className="w-4 h-4" />}>
              {t('common.edit')}
            </Button>
            <Button type="button" variant="danger" onClick={onDelete} leftIcon={<Trash2 className="w-4 h-4" />}>
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
                {t('areas.description')}
              </h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
                  {t('common.organizations')}
                </p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0">
                  {area.organization?.name || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
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
              <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark mb-4 m-0">
                {t('areas.additionalDetails')}
              </h2>
              <div className="mb-4">
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
                  {t('common.description')}
                </p>
                <p className="text-base text-textPrimary dark:text-textPrimary-dark m-0 leading-relaxed">
                  {area.description || t('areas.noDescription')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-1 m-0">
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
  );
};

export default AreaDetails;
