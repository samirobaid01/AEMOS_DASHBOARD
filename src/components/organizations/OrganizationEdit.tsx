import React from 'react';
import { useTranslation } from 'react-i18next';
import type { OrganizationUpdateRequest } from '../../types/organization';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { useThemeColors } from '../../hooks/useThemeColors';

interface OrganizationEditProps {
  formData: OrganizationUpdateRequest;
  formErrors: Record<string, string>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  organizationName?: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

const OrganizationEdit: React.FC<OrganizationEditProps> = ({
  formData,
  formErrors,
  isLoading,
  isSubmitting,
  error,
  organizationName,
  onSubmit,
  onChange,
  onCancel
}) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  
  // Styled objects for consistent styling
  const styles = {
    container: {
      padding: '1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    innerContainer: {
      maxWidth: '48rem',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap' as const,
      gap: '1rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.textPrimary,
      margin: 0,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: '0.5rem',
      boxShadow: colors.cardShadow,
      border: `1px solid ${colors.cardBorder}`,
      overflow: 'hidden',
    },
    form: {
      padding: '1.5rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    formRow: {
      marginBottom: '1.5rem',
    },
    fullWidth: {
      gridColumn: '1 / -1',
    },
    labelText: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: colors.textSecondary,
      marginBottom: '0.5rem',
    },
    textarea: {
      width: '100%',
      minHeight: '6rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.surfaceBackground,
      color: colors.textPrimary,
      fontSize: '0.875rem',
      resize: 'vertical' as const,
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '1.5rem',
    },
    checkbox: {
      marginRight: '0.5rem',
      width: '1rem',
      height: '1rem',
      accentColor: colors.buttonPrimary,
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: colors.textPrimary,
    },
    errorContainer: {
      backgroundColor: colors.dangerBackground,
      color: colors.dangerText,
      padding: '1rem',
      borderRadius: '0.375rem',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      marginTop: '1.5rem',
    },
    column: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    highlight: {
      color: colors.info,
      fontWeight: 600 as const
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            {t('edit_organization')} {organizationName && <span style={styles.highlight}>{organizationName}</span>}
          </h1>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
        </div>
        
        <div style={styles.card}>
          <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              {/* Name */}
              <div style={styles.fullWidth}>
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
              
              {/* Two column section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', gridColumn: '1 / -1' }}>
                {/* Email */}
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={onChange}
                    label={t('email')}
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
                  />
                </div>
              </div>
              
              {/* Description */}
              <div style={styles.fullWidth}>
                <div style={styles.column}>
                  <label htmlFor="detail" style={styles.labelText}>
                    {t('description')}
                  </label>
                  <textarea
                    id="detail"
                    name="detail"
                    rows={3}
                    value={formData.detail || ''}
                    onChange={onChange}
                    style={styles.textarea}
                  />
                </div>
              </div>
              
              {/* Address */}
              <div style={styles.fullWidth}>
                <div style={styles.column}>
                  <label htmlFor="address" style={styles.labelText}>
                    {t('address')}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address || ''}
                    onChange={onChange}
                    style={styles.textarea}
                  />
                </div>
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
                />
              </div>
              
              {/* Three column section for checkboxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '1rem', gridColumn: '1 / -1' }}>
                {/* Is Parent */}
                <div style={styles.checkboxContainer}>
                  <input
                    id="isParent"
                    name="isParent"
                    type="checkbox"
                    checked={formData.isParent}
                    onChange={onChange}
                    style={styles.checkbox}
                  />
                  <label htmlFor="isParent" style={styles.checkboxLabel}>
                    {t('is_parent_organization')}
                  </label>
                </div>
                
                {/* Status */}
                <div style={styles.checkboxContainer}>
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={formData.status}
                    onChange={onChange}
                    style={styles.checkbox}
                  />
                  <label htmlFor="status" style={styles.checkboxLabel}>
                    {t('active')}
                  </label>
                </div>
              </div>
            </div>
            
            {error && (
              <div style={styles.errorContainer}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.dangerText }}>{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div style={styles.buttonsContainer}>
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
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationEdit; 