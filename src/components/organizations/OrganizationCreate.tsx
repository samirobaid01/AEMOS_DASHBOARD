import React from 'react';
import { useTranslation } from 'react-i18next';
import type { OrganizationCreateRequest } from '../../types/organization';
import type { FormErrors } from '../../types/ui';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { useThemeColors } from '../../hooks/useThemeColors';

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
  const colors = useThemeColors();
  
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
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.header}>
          <h1 style={styles.title}>{t('new_organization')}</h1>
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
                  value={formData.name}
                  onChange={onChange}
                  label={t('name')}
                  placeholder={t('enter_organization_name')}
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
                    placeholder={t('enter_organization_description')}
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
                    placeholder={t('enter_address')}
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
                  placeholder={t('enter_zip_code')}
                />
              </div>
              
              {/* Status */}
              <div style={styles.fullWidth}>
                <label htmlFor="status" style={styles.labelText}>
                  {t('status')}
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.surfaceBackground,
                    color: colors.textPrimary,
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="pending">{t('pending')}</option>
                  <option value="suspended">{t('suspended')}</option>
                  <option value="archived">{t('archived')}</option>
                </select>
              </div>

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