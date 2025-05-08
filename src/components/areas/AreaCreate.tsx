import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AreaCreateRequest } from '../../types/area';
import type { Organization } from '../../types/organization';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

interface AreaCreateProps {
  formData: AreaCreateRequest;
  formErrors: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  organizations: Organization[];
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
}

const AreaCreate: React.FC<AreaCreateProps> = ({
  formData,
  formErrors,
  isLoading,
  error,
  organizations,
  onSubmit,
  onChange,
  onCancel
}) => {
  const { t } = useTranslation();
  
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
      color: '#2d3748',
      margin: 0,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
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
      color: '#4a5568',
      marginBottom: '0.5rem',
    },
    textarea: {
      width: '100%',
      minHeight: '6rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #cbd5e0',
      fontSize: '0.875rem',
      resize: 'vertical' as const,
    },
    select: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: '1px solid #cbd5e0',
      fontSize: '0.875rem',
      backgroundColor: '#ffffff',
    },
    selectError: {
      border: '1px solid #fc8181',
    },
    errorText: {
      color: '#e53e3e',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
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
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#4a5568',
    },
    errorContainer: {
      backgroundColor: '#fed7d7',
      color: '#822727',
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
          <h1 style={styles.title}>{t('new_area')}</h1>
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
                  placeholder={t('enter_area_name')}
                  error={formErrors.name}
                />
              </div>
              
              {/* Organization */}
              <div style={styles.fullWidth}>
                <div style={styles.column}>
                  <label htmlFor="organizationId" style={styles.labelText}>
                    {t('organization')}
                  </label>
                  <select
                    id="organizationId"
                    name="organizationId"
                    style={{
                      ...styles.select,
                      ...(formErrors.organizationId ? styles.selectError : {})
                    }}
                    value={formData.organizationId || ''}
                    onChange={onChange}
                    required
                  >
                    <option value="">{t('select_organization')}</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.organizationId && (
                    <p style={styles.errorText}>{formErrors.organizationId}</p>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div style={styles.fullWidth}>
                <div style={styles.column}>
                  <label htmlFor="description" style={styles.labelText}>
                    {t('description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={onChange}
                    style={styles.textarea}
                    placeholder={t('enter_area_description')}
                  />
                </div>
              </div>
              
              {/* Status */}
              <div>
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
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500 }}>{error}</h3>
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

export default AreaCreate; 