import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { Device } from '../../types/device';
import Button from '../../components/common/Button/Button';

interface OrganizationDetailsProps {
  organization: Organization | null;
  areas: Area[];
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  deleteModalOpen: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onDelete: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
}

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
  organization,
  areas,
  devices,
  isLoading,
  error,
  deleteModalOpen,
  isDeleting,
  onBack,
  onDelete,
  onOpenDeleteModal,
  onCloseDeleteModal
}) => {
  const { t } = useTranslation();

  // Styled components approach with objects
  const styles = {
    container: {
      padding: '1.5rem',
      maxWidth: '1200px',
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
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      marginBottom: '2rem',
    },
    cardSection: {
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#2d3748',
      marginBottom: '1rem',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      gap: '1rem',
      '@media (min-width: 640px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
    },
    detailItem: {
      marginBottom: '0.75rem',
    },
    detailLabel: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#718096',
      marginBottom: '0.25rem',
    },
    detailValue: {
      fontSize: '1rem',
      color: '#2d3748',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    badgeSuccess: {
      backgroundColor: '#c6f6d5',
      color: '#22543d',
    },
    badgeDanger: {
      backgroundColor: '#fed7d7',
      color: '#822727',
    },
    listContainer: {
      borderBottom: '1px solid #e2e8f0',
    },
    listItem: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #e2e8f0',
    },
    listItemLink: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      transition: 'background-color 0.2s',
    },
    listItemContent: {
      flex: 1,
      minWidth: 0,
    },
    listItemName: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#2d3748',
      marginBottom: '0.25rem',
    },
    listItemDescription: {
      fontSize: '0.75rem',
      color: '#718096',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    },
    modalContainer: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      width: '100%',
      maxWidth: '28rem',
      margin: '0 1rem',
    },
    modalHeader: {
      padding: '1.5rem',
    },
    modalIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '3rem',
      height: '3rem',
      borderRadius: '9999px',
      backgroundColor: '#fed7d7',
      color: '#e53e3e',
      marginRight: '1rem',
    },
    modalTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#2d3748',
    },
    modalBody: {
      padding: '0 1.5rem 1.5rem 1.5rem',
      fontSize: '0.875rem',
      color: '#4a5568',
    },
    modalFooter: {
      padding: '1rem 1.5rem',
      backgroundColor: '#f7fafc',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      borderBottomLeftRadius: '0.5rem',
      borderBottomRightRadius: '0.5rem',
    },
    errorContainer: {
      backgroundColor: '#fed7d7',
      color: '#822727',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    notFoundContainer: {
      backgroundColor: '#fefcbf',
      color: '#744210',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    buttonRow: {
      marginTop: '1rem',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      textDecoration: 'none',
    }
  };

  // Function to handle the hover effect
  const handleAreaLinkHover = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = '#f7fafc';
  };

  const handleAreaLinkLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = '';
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={styles.errorContainer}>
            <h3 style={{ fontWeight: 500 }}>{error}</h3>
          </div>
          <div style={styles.buttonRow}>
            <Button
              variant="outline"
              onClick={onBack}
            >
              {t('organizations.back_to_organizations')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div style={styles.container}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={styles.notFoundContainer}>
            <h3 style={{ fontWeight: 500 }}>{t('organizations.organization_not_found')}</h3>
          </div>
          <div style={styles.buttonRow}>
            <Button
              variant="outline"
              onClick={onBack}
            >
              {t('organizations.back_to_organizations')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{organization.name}</h1>
          <div style={styles.buttonGroup}>
            <Button
              variant="outline"
              onClick={onBack}
            >
              {t('common.back')}
            </Button>
            <Link to={`/organizations/${organization.id}/edit`}>
              <Button variant="primary">
                {t('common.edit')}
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={onOpenDeleteModal}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>

        {/* Organization Details Card */}
        <div style={styles.card}>
          {/* Organization Details */}
          <div style={styles.cardSection}>
            <h2 style={styles.cardTitle}>{t('organization_details')}</h2>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>{t('status')}</div>
                <div>
                  <span style={{
                    ...styles.badge,
                    ...(organization.status ? styles.badgeSuccess : styles.badgeDanger)
                  }}>
                    {organization.status ? t('active') : t('inactive')}
                  </span>
                </div>
              </div>
              
              <div style={styles.detailItem}>
                <div style={styles.detailLabel}>{t('organization_type')}</div>
                <div style={styles.detailValue}>
                  {organization.isParent ? t('parent_organization') : t('child_organization')}
                </div>
              </div>

              {organization.email && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>{t('email')}</div>
                  <div style={styles.detailValue}>{organization.email}</div>
                </div>
              )}

              {organization.contactNumber && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>{t('contact_number')}</div>
                  <div style={styles.detailValue}>{organization.contactNumber}</div>
                </div>
              )}

              {organization.address && (
                <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
                  <div style={styles.detailLabel}>{t('address')}</div>
                  <div style={styles.detailValue}>
                    {organization.address}
                    {organization.zip && `, ${organization.zip}`}
                  </div>
                </div>
              )}

              {organization.detail && (
                <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
                  <div style={styles.detailLabel}>{t('common.description')}</div>
                  <div style={styles.detailValue}>{organization.detail}</div>
                </div>
              )}
            </div>
          </div>

          {/* Areas Section */}
          <div style={styles.cardSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={styles.cardTitle}>{t('areas.title')}</h2>
              <Link to={`/areas/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">
                  {t('areas.add')}
                </Button>
              </Link>
            </div>
            
            {areas.length > 0 ? (
              <div>
                {areas.map(area => (
                  <div key={area.id} style={styles.listItem}>
                    <Link
                      to={`/areas/${area.id}`}
                      style={styles.link}
                      onMouseOver={handleAreaLinkHover}
                      onMouseOut={handleAreaLinkLeave}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2d3748' }}>{area.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {area.description || t('no_description')}
                        </p>
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: area.status ? '#c6f6d5' : '#fed7d7',
                          color: area.status ? '#22543d' : '#822727',
                        }}>
                          {area.status ? t('active') : t('inactive')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#718096' }}>{t('no_areas')}</p>
            )}
          </div>

          {/* Devices Section */}
          <div style={styles.cardSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={styles.cardTitle}>{t('devices.title')}</h2>
              <Link to={`/devices/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">
                  {t('add_device')}
                </Button>
              </Link>
            </div>
            
            {devices.length > 0 ? (
              <div>
                {devices.map(device => (
                  <div key={device.id} style={styles.listItem}>
                    <Link
                      to={`/devices/${device.id}`}
                      style={styles.link}
                      onMouseOver={handleAreaLinkHover}
                      onMouseOut={handleAreaLinkLeave}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2d3748' }}>{device.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#718096' }}>{device.serialNumber}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#718096', marginRight: '0.5rem' }}>{device.type}</span>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: device.status ? '#c6f6d5' : '#fed7d7',
                          color: device.status ? '#22543d' : '#822727',
                        }}>
                          {device.status ? t('active') : t('inactive')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#718096' }}>{t('no_devices')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            width: '100%',
            maxWidth: '28rem',
            margin: '0 1rem',
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '9999px',
                  backgroundColor: '#fed7d7',
                  color: '#e53e3e',
                  marginRight: '1rem',
                }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#2d3748' }}>{t('organizations.delete')}</h3>
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>
                      {t('organizations.delete_organization_confirm', { name: organization.name })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#f7fafc',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              borderBottomLeftRadius: '0.5rem',
              borderBottomRightRadius: '0.5rem',
            }}>
              <Button
                type="button"
                variant="danger"
                isLoading={isDeleting}
                disabled={isDeleting}
                onClick={onDelete}
              >
                {t('common.delete')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCloseDeleteModal}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDetails; 