import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import FormField from '../../components/common/FormField';
import FormActions from '../../components/common/FormActions';
import Button from '../../components/common/Button/Button';
import type { OrganizationEditProps } from './types';

const inputClasses =
  'block w-full px-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';
const textareaClasses =
  'block w-full min-h-24 px-3 py-2 rounded-lg border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-y';

const OrganizationEdit: React.FC<OrganizationEditProps> = ({
  formData,
  formErrors,
  isSubmitting,
  error,
  organizationName,
  onSubmit,
  onChange,
  onCancel
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-background dark:bg-background-dark p-4 sm:py-6 sm:px-8">
      <form onSubmit={onSubmit} className="w-full">
        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-border dark:border-border-dark">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-leaf-50 dark:bg-leaf-900/40 text-leaf-600 dark:text-leaf-400 grid place-items-center">
              <Building2 className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark m-0">
                {t('edit_organization')}
              </h2>
              <p className="text-sm text-textMuted dark:text-textMuted-dark mt-0.5 m-0 truncate">
                {organizationName || t('organizations.editSubtitle', { defaultValue: 'Update organization details' })}
              </p>
            </div>
          </div>
          <div className="p-6">
            {error && (
              <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}

            <FormField label={t('name')} id="name" required error={formErrors.name}>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name || ''}
                onChange={onChange}
                className={inputClasses}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label={t('email')} id="email" error={formErrors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={onChange}
                  className={inputClasses}
                />
              </FormField>
              <FormField label={t('contact_number')} id="contactNumber">
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber || ''}
                  onChange={onChange}
                  className={inputClasses}
                />
              </FormField>
            </div>

            <FormField label={t('description')} id="detail">
              <textarea
                id="detail"
                name="detail"
                rows={3}
                value={formData.detail || ''}
                onChange={onChange}
                className={textareaClasses}
              />
            </FormField>

            <FormField label={t('address')} id="address">
              <textarea
                id="address"
                name="address"
                rows={2}
                value={formData.address || ''}
                onChange={onChange}
                className={textareaClasses}
              />
            </FormField>

            <FormField label={t('zip_code')} id="zip">
              <input
                id="zip"
                name="zip"
                type="text"
                value={formData.zip || ''}
                onChange={onChange}
                className={inputClasses}
              />
            </FormField>

            <FormField label={t('status')} id="status">
              <select id="status" name="status" value={formData.status ?? 'active'} onChange={onChange} className={selectClasses}>
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="suspended">{t('suspended')}</option>
                <option value="archived">{t('archived')}</option>
              </select>
            </FormField>

            <div className="flex items-center mb-6">
              <input
                id="isParent"
                name="isParent"
                type="checkbox"
                checked={formData.isParent}
                onChange={onChange}
                className="mr-2 w-4 h-4 accent-primary"
              />
              <label htmlFor="isParent" className="text-sm text-textPrimary dark:text-textPrimary-dark">
                {t('is_parent_organization')}
              </label>
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

export default OrganizationEdit;
