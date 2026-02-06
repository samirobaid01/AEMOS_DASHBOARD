import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { Device } from '../../types/device';
import Button from '../../components/common/Button/Button';
import { useThemeColors } from '../../hooks/useThemeColors';
import type { Sensor } from '../../types/sensor';

interface OrganizationDetailsProps {
  organization: Organization | null;
  areas: Area[];
  devices: Device[];
  sensors: Sensor[];
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
  sensors,
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
  const colors = useThemeColors();

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
      color: colors.textPrimary,
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: '0.5rem',
      boxShadow: colors.cardShadow,
      border: `1px solid ${colors.cardBorder}`,
      overflow: 'hidden',
      marginBottom: '2rem',
    },
    cardSection: {
      padding: '1.5rem',
      borderBottom: `1px solid ${colors.border}`,
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.textPrimary,
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
      color: colors.textMuted,
      marginBottom: '0.25rem',
    },
    detailValue: {
      fontSize: '1rem',
      color: colors.textPrimary,
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
      backgroundColor: colors.successBackground,
      color: colors.successText,
    },
    badgeDanger: {
      backgroundColor: colors.dangerBackground,
      color: colors.dangerText,
    },
    listContainer: {
      borderBottom: `1px solid ${colors.border}`,
    },
    listItem: {
      padding: '0.75rem 0',
      borderBottom: `1px solid ${colors.border}`,
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
      color: colors.textPrimary,
      marginBottom: '0.25rem',
    },
    listItemDescription: {
      fontSize: '0.75rem',
      color: colors.textMuted,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    modalOverlay: {
      position: 'fixed' as const,
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
      backgroundColor: colors.cardBackground,
      borderRadius: '0.5rem',
      boxShadow: colors.cardShadow,
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
      backgroundColor: colors.dangerBackground,
      color: colors.danger,
      marginRight: '1rem',
    },
    modalTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    modalBody: {
      padding: '0 1.5rem 1.5rem 1.5rem',
      fontSize: '0.875rem',
      color: colors.textSecondary,
    },
    modalFooter: {
      padding: '1rem 1.5rem',
      backgroundColor: colors.surfaceBackground,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      borderBottomLeftRadius: '0.5rem',
      borderBottomRightRadius: '0.5rem',
    },
    errorContainer: {
      backgroundColor: colors.dangerBackground,
      color: colors.dangerText,
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem',
    },
    notFoundContainer: {
      backgroundColor: colors.warningBackground,
      color: colors.warningText,
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
    e.currentTarget.style.backgroundColor = colors.sidebarItemHover;
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
              {t('organizations.backToOrganizations')}
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
              {t('organizations.backToOrganizations')}
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
            <h2 style={styles.cardTitle}>{t('organizations.detail')}</h2>
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
                <div style={styles.detailLabel}>{t('organizations.organizationType')}</div>
                <div style={styles.detailValue}>
                  {organization.isParent ? t('organizations.parentOrganization') : t('organizations.childOrganization')}
                </div>
              </div>

              {organization.email && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>{t('organizations.email')}</div>
                  <div style={styles.detailValue}>{organization.email}</div>
                </div>
              )}

              {organization.contactNumber && (
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>{t('organizations.contactNumber')}</div>
                  <div style={styles.detailValue}>{organization.contactNumber}</div>
                </div>
              )}

              {organization.address && (
                <div style={{ ...styles.detailItem, gridColumn: 'span 2' }}>
                  <div style={styles.detailLabel}>{t('organizations.address')}</div>
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
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.textPrimary }}>{area.name}</p>
                        <p style={{ fontSize: '0.75rem', color: colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {area.description || t('areas.noDescription')}
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
                          backgroundColor: area.status ? colors.successBackground : colors.dangerBackground,
                          color: area.status ? colors.successText : colors.dangerText,
                        }}>
                          {area.status ? t('active') : t('inactive')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: colors.textMuted }}>{t('no_areas')}</p>
            )}
          </div>
          {/* Sensors Section */}
          <div style={styles.cardSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={styles.cardTitle}>{t('sensors.title')}</h2>
              <Link to={`/sensors/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">
                  {t('sensors.add')}
                </Button>
              </Link>
            </div>
            {sensors.length > 0 ? (
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
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.textPrimary }}>{device.name}</p>
                        <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>{device.uuid}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: device.status === 'active' ? colors.successBackground : colors.dangerBackground,
                          color: device.status === 'active' ? colors.successText : colors.dangerText,
                        }}>
                          {device.status === 'active' ? t('active') : t('inactive')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: colors.textMuted }}>{t('no_sensors')}</p>
            )}

          </div>
          {/* Devices Section */}
          <div style={styles.cardSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={styles.cardTitle}>{t('devices.title')}</h2>
              <Link to={`/devices/create?organizationId=${organization.id}`}>
                <Button variant="outline" size="sm">
                  {t('devices.add')}
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
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.textPrimary }}>{device.name}</p>
                        <p style={{ fontSize: '0.75rem', color: colors.textMuted }}>{device.uuid}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: device.status === 'active' ? colors.successBackground : colors.dangerBackground,
                          color: device.status === 'active' ? colors.successText : colors.dangerText,
                        }}>
                          {device.status === 'active' ? t('active') : t('inactive')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: colors.textMuted }}>{t('no_devices')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContainer}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={styles.modalIcon}>
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 style={styles.modalTitle}>{t('organizations.delete')}</h3>
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                      {t('organizations.delete_organization_confirm', { name: organization.name })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
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