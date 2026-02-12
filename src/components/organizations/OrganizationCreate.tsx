import React from 'react';
import { useTranslation } from 'react-i18next';
import type { OrganizationCreateRequest } from '../../types/organization';
import type { FormErrors } from '../../types/ui';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

interface OrganizationCreateProps {
  formData: OrganizationCreateRequest;
  formErrors: FormErrors;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

const OrganizationCreate: React.FC<OrganizationCreateProps> = ({
  formData,
  formErrors,
  isLoading,
  error,
  onSubmit,
  onChange,
  onCancel
}) => {
  const { t } = useTranslation();

  const selectClasses =
    'w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-2xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">{t('new_organization')}</h1>
          <Button variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
        </div>
        <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <form onSubmit={onSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Name */}
              <div className="col-span-full">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={onChange}
                  label={t('name')}
                  placeholder={t('enter_organization_name')}
                  error={formErrors.name}
                />
              </div>
              
              {/* Two column section */}
              <div className="grid grid-cols-2 gap-4 col-span-full">
                {/* Email */}
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={onChange}
                    label={t('email')}
                    placeholder={t('enter_organization_email')}
                    error={formErrors.email}
                  />
                </div>
                
                {/* Contact Number */}
                <div>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={formData.contactNumber || ''}
                    onChange={onChange}
                    label={t('contact_number')}
                    placeholder={t('enter_contact_number')}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="col-span-full">
                <label htmlFor="detail" className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
                  {t('description')}
                </label>
                <textarea
                  id="detail"
                  name="detail"
                  rows={3}
                  value={formData.detail || ''}
                  onChange={onChange}
                  placeholder={t('enter_organization_description')}
                  className="w-full min-h-24 px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm resize-y"
                />
              </div>
              {/* Address */}
              <div className="col-span-full">
                <label htmlFor="address" className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
                  {t('address')}
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address || ''}
                  onChange={onChange}
                  placeholder={t('enter_address')}
                  className="w-full min-h-24 px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm resize-y"
                />
              </div>
              
              {/* Zip Code */}
              <div>
                <Input
                  id="zip"
                  name="zip"
                  type="text"
                  value={formData.zip || ''}
                  onChange={onChange}
                  label={t('zip_code')}
                  placeholder={t('enter_zip_code')}
                />
              </div>
              
              {/* Status */}
              <div className="col-span-full">
                <label htmlFor="status" className="block text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2">
                  {t('status')}
                </label>
                <select id="status" name="status" value={formData.status} onChange={onChange} className={selectClasses}>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="pending">{t('pending')}</option>
                  <option value="suspended">{t('suspended')}</option>
                  <option value="archived">{t('archived')}</option>
                </select>
              </div>
              {/* Is Parent */}
              <div className="flex items-center mt-6">
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
            </div>
            {error && (
              <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-4 rounded-md mb-6 text-sm">
                <h3 className="text-sm font-medium">{error}</h3>
              </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {t('create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCreate; 