import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Area, AreaCreateRequest, AreaUpdateRequest } from '../../types/area';
import { useThemeColors } from '../../hooks/useThemeColors';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import Button from '../common/Button/Button';

interface Organization {
  id: number;
  name: string;
}

// Extending the AreaCreateRequest and AreaUpdateRequest types to include parentAreaId
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
  const colors = useThemeColors();
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
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'organizationId' || name === 'parentAreaId') {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : undefined,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formStyle = {
    backgroundColor: colors.cardBackground,
    borderRadius: '0.5rem',
    boxShadow: colors.cardShadow,
    border: `1px solid ${colors.cardBorder}`,
    overflow: 'hidden',
  };

  const headerStyle = {
    backgroundColor: colors.surfaceBackground,
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  };

  const headerTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: colors.textPrimary,
    margin: 0,
  };

  const headerDescriptionStyle = {
    fontSize: '0.875rem',
    color: colors.textMuted,
    marginTop: '0.5rem',
  };

  const bodyStyle = {
    padding: '1.5rem',
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${colors.border}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: colors.surfaceBackground,
    color: colors.textPrimary,
    outline: 'none',
  };

  const selectStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${colors.border}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: colors.surfaceBackground,
    color: colors.textPrimary,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    outline: 'none',
    appearance: 'none',
  } as React.CSSProperties;

  const textareaStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${colors.border}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: colors.surfaceBackground,
    color: colors.textPrimary,
    outline: 'none',
    minHeight: '6rem',
    resize: 'vertical' as const,
  };

  const errorMessageStyle = {
    backgroundColor: colors.dangerBackground,
    color: colors.dangerText,
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
  };

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem 2rem' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <div style={formStyle}>
          <div style={headerStyle}>
            <h2 style={headerTitleStyle}>
              {isEditMode ? t('areas.edit') : t('areas.add')}
            </h2>
            <p style={headerDescriptionStyle}>
              {isEditMode ? t('areas.edit_area_description') : t('areas.add_area_description')}
            </p>
          </div>

          <div style={bodyStyle}>
            {error && (
              <div style={errorMessageStyle}>
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
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                  e.target.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = colors.border;
                }}
              />
            </FormField>

            <FormField label={t('areas.organization')} id="organizationId" required>
              <select
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                required
                style={selectStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                  e.target.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = colors.border;
                }}
              >
                <option value="" disabled>
                  {t('areas.select_organization')}
                </option>
                {safeOrganizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
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
                  style={selectStyle}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                    e.target.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = colors.border;
                  }}
                >
                  <option value="">{t('areas.no_parent_area')}</option>
                  {safeParentAreas.map((parentArea) => (
                    <option key={parentArea.id} value={parentArea.id}>
                      {parentArea.name}
                    </option>
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
                style={{
                  ...inputStyle,
                  width: '100%',
                }}
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
                style={textareaStyle}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                  e.target.style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = colors.border;
                }}
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