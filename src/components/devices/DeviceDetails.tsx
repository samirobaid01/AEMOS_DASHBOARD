import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '../common/Loading/LoadingScreen';
import type { Device } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import type { DeviceStatus } from '../../constants/device';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { fetchDeviceStates, selectDeviceStates, selectDeviceStatesLoading, selectDeviceStatesError } from '../../state/slices/deviceStates.slice';
import StateDropdown from '../common/Select/StateDropdown';
import { API_URL } from '../../config';
import { useDeviceStateSocket } from '../../hooks/useDeviceStateSocket';
import type { DeviceStateNotification } from '../../hooks/useDeviceStateSocket';
import Button from '../common/Button/Button';
import DeviceStateModal from './DeviceStateModal';

interface DeviceDetailsProps {
  device: Device | null;
  organization: Organization | null;
  area: Area | null;
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  deleteModalOpen: boolean;
  onDelete: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
  onNavigateBack: () => void;
  onStateButtonClick: (state: any) => void;
  selectedState: {
    id: number;
    name: string;
    value: string;
    defaultValue: string;
    allowedValues: string[];
  } | null;
  onStateModalClose: () => void;
  onStateModalSave: (value: string) => void;
  isStateUpdating: boolean;
  isSocketConnected: boolean;
  socketError: Error | null;
}

interface DeviceState {
  id: number;
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
  createdAt: string;
  updatedAt: string;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({
  device,
  organization,
  area,
  isLoading,
  error,
  isDeleting,
  deleteModalOpen,
  onDelete,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onNavigateBack,
  onStateButtonClick,
  selectedState,
  onStateModalClose,
  onStateModalSave,
  isStateUpdating,
  isSocketConnected,
  socketError
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const deviceStates = useAppSelector(selectDeviceStates);
  const statesLoading = useAppSelector(selectDeviceStatesLoading);
  const statesError = useAppSelector(selectDeviceStatesError);
  const authToken = useAppSelector((state) => state.auth.token);
  const isMobile = window.innerWidth < 768;

  // Remove socket connection since we're getting it from props now
  const containerStyle = {
    padding: isMobile ? '1rem' : '1.5rem 2rem',
    backgroundColor: darkMode ? colors.background : 'transparent'
  };

  const contentContainerStyle = {
    maxWidth: '48rem',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' as const : 'center' as const,
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    marginBottom: '1.5rem',
    gap: isMobile ? '1rem' : '0'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: isMobile ? 'wrap' as const : 'nowrap' as const,
    width: isMobile ? '100%' : 'auto',
  };

  const buttonStyle = (variant: 'primary' | 'secondary' | 'danger') => ({
    padding: '0.5rem 1rem',
    backgroundColor:
      variant === 'primary'
        ? darkMode
          ? '#4d7efa'
          : '#3b82f6'
        : variant === 'danger'
        ? darkMode
          ? '#ef5350'
          : '#ef4444'
        : darkMode
        ? colors.surfaceBackground
        : 'white',
    color:
      variant === 'secondary'
        ? darkMode
          ? colors.textSecondary
          : '#4b5563'
        : 'white',
    border:
      variant === 'secondary'
        ? `1px solid ${darkMode ? colors.border : '#d1d5db'}`
        : 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? '0' : '5rem',
    textDecoration: 'none'
  });

  const cardStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    overflow: 'hidden'
  };

  const sectionStyle = {
    padding: '1.5rem',
    borderBottom: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`
  };

  const sectionTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    marginBottom: '1rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '1.5rem'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#6b7280',
    marginBottom: '0.25rem'
  };

  const valueStyle = {
    fontSize: '1rem',
    color: darkMode ? colors.textPrimary : '#111827'
  };

  const getStatusBadgeStyle = (status: DeviceStatus) => {
    const statusColors: Record<DeviceStatus, { bg: string; text: string; dot: string }> = {
      active: {
        bg: darkMode ? 'rgba(52, 211, 153, 0.2)' : '#dcfce7',
        text: darkMode ? '#34d399' : '#166534',
        dot: '#16a34a'
      },
      inactive: {
        bg: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
        text: darkMode ? '#ef4444' : '#b91c1c',
        dot: '#ef4444'
      },
      pending: {
        bg: darkMode ? 'rgba(234, 179, 8, 0.2)' : '#fef3c7',
        text: darkMode ? '#eab308' : '#92400e',
        dot: '#eab308'
      },
      maintenance: {
        bg: darkMode ? 'rgba(249, 115, 22, 0.2)' : '#ffedd5',
        text: darkMode ? '#fb923c' : '#c2410c',
        dot: '#ea580c'
      },
      faulty: {
        bg: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
        text: darkMode ? '#ef4444' : '#b91c1c',
        dot: '#ef4444'
      },
      retired: {
        bg: darkMode ? 'rgba(107, 114, 128, 0.2)' : '#f3f4f6',
        text: darkMode ? '#9ca3af' : '#6b7280',
        dot: '#6b7280'
      }
    };
    const colors = statusColors[status];

    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.625rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: colors.bg,
      color: colors.text,
      dot: {
        width: '0.5rem',
        height: '0.5rem',
        borderRadius: '50%',
        backgroundColor: colors.dot,
        marginRight: '0.375rem'
      }
    };
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  };

  const modalStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '28rem',
    position: 'relative' as const
  };

  const modalIconStyle = {
    width: '2.5rem',
    height: '2.5rem',
    backgroundColor: darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  };

  const statesGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    padding: '1.5rem',
  };

  const stateCardStyle = {
    backgroundColor: darkMode ? colors.surfaceBackground : '#f9fafb',
    borderRadius: '0.5rem',
    padding: '1rem',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`
  };

  useEffect(() => {
    if (device?.id && device?.organizationId) {
      dispatch(fetchDeviceStates({ deviceId: device.id, organizationId: device.organizationId }));
    }
  }, [dispatch, device?.id, device?.organizationId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={contentContainerStyle}>
          <div style={{
            backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
            color: darkMode ? colors.dangerText : '#b91c1c',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
          <Button type="button" variant="secondary" onClick={onNavigateBack}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div style={containerStyle}>
        <div style={contentContainerStyle}>
          <div style={{
            backgroundColor: darkMode ? colors.warningBackground : '#fef3c7',
            color: darkMode ? colors.warningText : '#92400e',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}>
            {t('devices.deviceNotFound')}
          </div>
          <Button type="button" variant="secondary" onClick={onNavigateBack}>
            {t('devices.backToDevices')}
          </Button>
        </div>
      </div>
    );
  }

  const renderDeviceStates = () => {
    if (!device.states || device.states.length === 0) {
      return null;
    }

    return (
      <div style={cardStyle}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '1.5rem 1.5rem 0'
        }}>
          <h2 style={sectionTitleStyle}>
            {t('devices.detail.deviceStatus')}
            {isSocketConnected && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: darkMode ? colors.successText : '#166534',
              }}>
                <span style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: '#16a34a',
                  marginRight: '0.375rem',
                  animation: 'pulse 2s infinite',
                }}></span>
                {t('live')}
              </span>
            )}
          </h2>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/debug/device-state-test')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
              color: darkMode ? colors.infoText : '#1e40af',
              border: 'none',
            }}
          >
            <svg style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('devices.detail.socketDebug')}
          </Button>
        </div>

        {socketError && (
          <div style={{
            margin: '0 1.5rem 1rem',
            padding: '0.75rem',
            backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
            color: darkMode ? colors.dangerText : '#b91c1c',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            {socketError.message}
          </div>
        )}

        <div style={statesGridStyle}>
          {device.states.map((state) => {
            const allowedValues = JSON.parse(state.allowedValues);
            const currentValue = state.instances[0]?.value || state.defaultValue;

            return (
              <div key={state.id} style={stateCardStyle}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: darkMode ? colors.textPrimary : '#111827'
                  }}>
                    {state.stateName}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onStateButtonClick(state)}
                  >
                    {t('change')}
                  </Button>
                </div>
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: darkMode ? colors.surfaceBackground : '#f3f4f6',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  color: darkMode ? colors.textSecondary : '#4b5563'
                }}>
                  {currentValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // const renderNotifications = () => {
  //   return (
  //     <div style={cardStyle}>
  //       <h2 style={sectionTitleStyle}>{t('device_states')}
  //         {isSocketConnected && (
  //           <span style={{
  //             display: 'inline-flex',
  //             alignItems: 'center',
  //             marginLeft: '0.75rem',
  //             fontSize: '0.75rem',
  //             fontWeight: 500,
  //             color: darkMode ? colors.successText : '#166534',
  //           }}>
  //             <span style={{
  //               width: '0.5rem',
  //               height: '0.5rem',
  //               borderRadius: '50%',
  //               backgroundColor: '#16a34a',
  //               marginRight: '0.375rem',
  //               animation: 'pulse 2s infinite',
  //             }}></span>
  //             {t('live')}
  //           </span>
  //         )}
  //       </h2>
  //       {socketError && (
  //         <div style={{
  //           padding: '0.75rem',
  //           marginTop: '1rem',
  //           backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
  //           color: darkMode ? colors.dangerText : '#b91c1c',
  //           borderRadius: '0.375rem',
  //         }}>
  //           {socketError.message}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div style={containerStyle}>
      <div style={contentContainerStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onNavigateBack}
              style={{
                marginRight: '0.75rem',
                padding: '0.5rem',
                minWidth: 'auto',
              }}
            >
              <svg
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: darkMode ? colors.textSecondary : '#4b5563'
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Button>
            <h1 style={titleStyle}>{device.name}</h1>
          </div>

          <div style={buttonGroupStyle}>
            <Link
              to={`/devices/${device.id}/edit`}
              style={buttonStyle('primary')}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
              }}
            >
              <svg
                style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {t('edit')}
            </Link>
            <Button type="button" variant="danger" onClick={onOpenDeleteModal}>
              <svg
                style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {t('delete')}
            </Button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{t('device_details')}</h2>
            <div style={gridStyle}>
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={labelStyle}>{t('devices.deviceType')}</p>
                  <p style={valueStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
                      color: darkMode ? colors.infoText : '#1e40af',
                      borderRadius: '9999px',
                      fontSize: '0.75rem'
                    }}>
                      {device.deviceType}
                    </span>
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={labelStyle}>{t('devices.status')}</p>
                  <p style={valueStyle}>
                    <span style={getStatusBadgeStyle(device.status)}>
                      <span style={getStatusBadgeStyle(device.status).dot}></span>
                      {t(`devices.statuses.${device.status}`)}
                    </span>
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={labelStyle}>{t('devices.controlType')}</p>
                  <p style={valueStyle}>
                    {device.controlType}
                  </p>
                </div>

                {device.communicationProtocol && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={labelStyle}>{t('devices.protocol')}</p>
                    <p style={valueStyle}>
                      {t(`devices.protocols.${device.communicationProtocol}`)}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <p style={labelStyle}>{t('devices.organization')}</p>
                  <p style={valueStyle}>
                    {organization ? (
                      <Link
                        to={`/organizations/${device.organizationId}`}
                        style={{
                          color: darkMode ? '#4d7efa' : '#3b82f6',
                          textDecoration: 'none'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = darkMode ? '#5d8efa' : '#2563eb';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = darkMode ? '#4d7efa' : '#3b82f6';
                        }}
                      >
                        {organization.name}
                      </Link>
                    ) : (
                      t('not_available')
                    )}
                  </p>
                </div>

                {area && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={labelStyle}>{t('devices.area')}</p>
                    <p style={valueStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: darkMode ? colors.successBackground : '#dcfce7',
                        color: darkMode ? colors.successText : '#166534',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}>
                        {area.name}
                      </span>
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: '1rem' }}>
                  <p style={labelStyle}>{t('devices.isCritical')}</p>
                  <p style={valueStyle}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: device.isCritical
                        ? (darkMode ? colors.dangerBackground : '#fee2e2')
                        : (darkMode ? colors.surfaceBackground : '#f3f4f6'),
                      color: device.isCritical
                        ? (darkMode ? colors.dangerText : '#b91c1c')
                        : (darkMode ? colors.textSecondary : '#4b5563'),
                      borderRadius: '9999px',
                      fontSize: '0.75rem'
                    }}>
                      {device.isCritical ? t('yes') : t('no')}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {device.description && (
              <div style={{ marginTop: '1rem' }}>
                <p style={labelStyle}>{t('devices.description')}</p>
                <p style={valueStyle}>{device.description}</p>
              </div>
            )}

            {device.controlModes && (
              <div style={{ marginTop: '1rem' }}>
                <p style={labelStyle}>{t('devices.controlModes')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
                  {device.controlModes.split(',').map(mode => (
                    <span
                      key={mode}
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
                        color: darkMode ? colors.infoText : '#1e40af',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {mode}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {device.controlType === 'range' && (
              <div style={{ marginTop: '1rem' }}>
                <p style={labelStyle}>{t('devices.range')}</p>
                <p style={valueStyle}>{device.minValue} - {device.maxValue}</p>
              </div>
            )}

            {device.defaultState && (
              <div style={{ marginTop: '1rem' }}>
                <p style={labelStyle}>{t('devices.defaultState')}</p>
                <p style={valueStyle}>{device.defaultState}</p>
              </div>
            )}
          </div>

          {Object.keys(device.capabilities || {}).length > 0 && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>{t('devices.capabilities')}</h3>
              <div style={gridStyle}>
                {Object.entries(device.capabilities || {}).map(([key, value]) => (
                  <div key={key}>
                    <p style={labelStyle}>{key}</p>
                    <p style={valueStyle}>
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderDeviceStates()}
          {/* {renderNotifications()} */}
        </div>
      </div>

      {deleteModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={modalIconStyle}>
                <svg
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    color: darkMode ? '#ef5350' : '#ef4444'
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: darkMode ? colors.textPrimary : '#111827',
                marginBottom: '0.5rem'
              }}>
                {t('devices.deleteDevice')}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: darkMode ? colors.textSecondary : '#6b7280',
                marginBottom: '1.5rem'
              }}>
                {t('devices.deleteDeviceConfirm', { name: device.name })}
              </p>
            </div>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'flex-end'
            }}>
              <Button type="button" variant="secondary" onClick={onCloseDeleteModal}>
                {t('cancel')}
              </Button>
              <Button type="button" variant="danger" onClick={onDelete} disabled={isDeleting}>
                {isDeleting ? t('deleting') : t('delete')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedState && (
        <DeviceStateModal
          isOpen={!!selectedState}
          onClose={onStateModalClose}
          stateName={selectedState.name}
          currentValue={selectedState.value}
          defaultValue={selectedState.defaultValue}
          allowedValues={selectedState.allowedValues}
          onSave={onStateModalSave}
          isLoading={isStateUpdating}
        />
      )}
    </div>
  );
};

export default DeviceDetails; 