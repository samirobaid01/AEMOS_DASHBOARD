import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AreaUpdateRequest } from '../../types/area';
import type { FormErrors } from '../../types/ui';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';

interface AreaEditProps {
  formData: AreaUpdateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  areaName?: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

const selectClasses =
  'w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';

const AreaEdit: React.FC<AreaEditProps> = ({
  formData,
  formErrors,
  isSubmitting,
  error,
  areaName,
  onSubmit,
  onChange,
  onCancel
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
            {t('edit_area')} {areaName && <span className="text-info dark:text-info-dark font-semibold">{areaName}</span>}
          </h1>
          <Button variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
        </div>
        <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <form onSubmit={onSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="col-span-full">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={onChange}
                  label={t('name')}
                  error={formErrors.name}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={onChange}
                  className="w-full min-h-24 px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm resize-y"
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="status" className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
                  {t('status')}
                </label>
                <select id="status" name="status" value={formData.status ?? 'active'} onChange={onChange} className={selectClasses}>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="under_review">{t('under_review')}</option>
                  <option value="archived">{t('archived')}</option>
                </select>
              </div>
            </div>
            {error && (
              <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-md mb-6 text-sm">
                <h3 className="text-sm font-medium">{error}</h3>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AreaEdit;
