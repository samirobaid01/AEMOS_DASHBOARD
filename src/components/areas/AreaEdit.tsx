import React from 'react';
import { useTranslation } from 'react-i18next';
import { Map, ArrowLeft } from 'lucide-react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import FormActions from '../common/FormActions';
import { useGoBack } from '../../hooks/useGoBack';
import type { AreaEditProps } from './types';

const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const textareaClasses =
  'block w-full min-h-24 px-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y';
const labelClasses = 'block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2';

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
  const goBack = useGoBack('/areas');

  return (
    <div className="bg-background dark:bg-background-dark p-4 sm:py-6 sm:px-8">
      <form onSubmit={onSubmit} className="w-full">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={goBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
        >
          {t('common.back')}
        </Button>
        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-border dark:border-border-dark">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
              <Map className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0">
                {t('edit_area')} {areaName && <span className="text-leaf-600 dark:text-leaf-400">{areaName}</span>}
              </h2>
              <p className="text-sm text-textMuted dark:text-textMuted-dark mt-0.5 m-0">
                {t('areas.edit_area_description')}
              </p>
            </div>
          </div>
          <div className="p-6">
            {error && (
              <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-md mb-6 text-sm">
                <h3 className="text-sm font-medium">{error}</h3>
              </div>
            )}
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
                <label htmlFor="description" className={labelClasses}>
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={onChange}
                  className={textareaClasses}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="status" className={labelClasses}>
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
            <FormActions>
              <Button type="button" variant="secondary" onClick={onCancel}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                {t('save')}
              </Button>
            </FormActions>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AreaEdit;
