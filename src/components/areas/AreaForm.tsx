import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Area, AreaCreateRequest, AreaUpdateRequest } from '../../types/area';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import Button from '../common/Button/Button';

interface Organization {
  id: number;
  name: string;
}

interface ExtendedAreaCreateRequest extends AreaCreateRequest {
  parentAreaId?: number;
}

interface ExtendedAreaUpdateRequest extends AreaUpdateRequest {
  parentAreaId?: number;
}

interface AreaFormProps {
  area?: Area | null;
  organizations: Organization[];
  parentAreas?: Area[];
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: ExtendedAreaCreateRequest | ExtendedAreaUpdateRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  windowWidth: number;
  isEditMode?: boolean;
}

const inputClasses =
  'block w-full px-3 py-2 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';
const textareaClasses =
  'block w-full min-h-24 px-3 py-2 rounded border border-border dark:border-border-dark text-sm bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark outline-none focus:ring-2 focus:ring-primary resize-y';

const AreaForm: React.FC<AreaFormProps> = ({
  area,
  organizations = [],
  parentAreas = [],
  error,
  onSubmit,
  onCancel,
  isSubmitting,
  windowWidth,
  isEditMode = false,
}) => {
  const { t } = useTranslation();
  const isMobile = windowWidth < 768;
  const safeOrganizations = Array.isArray(organizations) ? organizations : [];
  const safeParentAreas = Array.isArray(parentAreas) ? parentAreas : [];

  const [formData, setFormData] = React.useState<ExtendedAreaCreateRequest | ExtendedAreaUpdateRequest>({
    name: area?.name || '',
    organizationId: area?.organizationId || (safeOrganizations.length > 0 ? safeOrganizations[0].id : 0),
    description: area?.description || '',
    status: area?.status ?? 'active',
    parentAreaId: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (name === 'organizationId' || name === 'parentAreaId') {
      setFormData({ ...formData, [name]: value ? parseInt(value, 10) : undefined });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={isMobile ? 'p-4' : 'p-6 px-8'}>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark">
            <h2 className="text-xl font-semibold text-textPrimary dark:text-textPrimary-dark m-0">
              {isEditMode ? t('areas.edit') : t('areas.add')}
            </h2>
            <p className="text-sm text-textMuted dark:text-textMuted-dark mt-2 m-0">
              {isEditMode ? t('areas.edit_area_description') : t('areas.add_area_description')}
            </p>
          </div>
          <div className="p-6">
            {error && (
              <div className="bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 rounded-md text-sm mb-6">
                {error}
              </div>
            )}
            <FormField label={t('areas.area_name')} id="name" required>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label={t('areas.organization')} id="organizationId" required>
              <select
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                required
                className={selectClasses}
              >
                <option value="" disabled>{t('areas.select_organization')}</option>
                {safeOrganizations.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </FormField>
            {safeParentAreas.length > 0 && (
              <FormField label={t('areas.parent_area')} id="parentAreaId">
                <select
                  id="parentAreaId"
                  name="parentAreaId"
                  value={formData.parentAreaId || ''}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="">{t('areas.no_parent_area')}</option>
                  {safeParentAreas.map((parentArea) => (
                    <option key={parentArea.id} value={parentArea.id}>{parentArea.name}</option>
                  ))}
                </select>
              </FormField>
            )}
            <FormField label={t('status')} id="status">
              <select
                id="status"
                name="status"
                value={typeof formData.status === 'string' ? formData.status : 'active'}
                onChange={handleChange}
                className={selectClasses}
              >
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
                <option value="under_review">{t('under_review')}</option>
                <option value="archived">{t('archived')}</option>
              </select>
            </FormField>
            <FormField label={t('areas.description')} id="description">
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className={textareaClasses}
              />
            </FormField>
            <FormActions>
              <Button type="button" variant="secondary" onClick={onCancel}>
                {t('areas.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('areas.saving') : isEditMode ? t('areas.update') : t('areas.create')}
              </Button>
            </FormActions>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AreaForm;
