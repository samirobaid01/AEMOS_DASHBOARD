import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTelemetrySocket } from '../../hooks/useTelemetrySocket';
import type { Sensor } from '../../types/sensor';

interface SensorDetailsProps {
  sensor: Sensor | null;
  isLoading: boolean;
  error: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  windowWidth: number;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({
  sensor,
  isLoading,
  error,
  onEdit,
  onDelete,
  onBack,
  windowWidth,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;
  const { telemetryValues, connected } = useTelemetrySocket(sensor?.TelemetryData);

  if (!sensor) {
    return null;
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    flexDirection: isMobile ? ("column" as const) : ("row" as const),
    marginBottom: "1.5rem",
    gap: isMobile ? "1rem" : "0",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : "#111827",
    margin: 0,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "0.5rem",
    flexWrap: isMobile ? ("wrap" as const) : ("nowrap" as const),
    width: isMobile ? "100%" : "auto",
  };

  const buttonStyle = (variant: "primary" | "secondary" | "danger") => ({
    padding: "0.5rem 1rem",
    backgroundColor:
      variant === "primary"
        ? darkMode
          ? "#4d7efa"
          : "#3b82f6"
        : variant === "danger"
        ? darkMode
          ? "#ef5350"
          : "#ef4444"
        : darkMode
        ? colors.surfaceBackground
        : "white",
    color:
      variant === "secondary"
        ? darkMode
          ? colors.textSecondary
          : "#4b5563"
        : "white",
    border:
      variant === "secondary"
        ? `1px solid ${darkMode ? colors.border : "#d1d5db"}`
        : "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexGrow: isMobile ? 1 : 0,
    minWidth: isMobile ? "0" : "5rem",
  });

  // Helper function to format telemetry values based on their type
  const formatTelemetryValue = (value: any, datatype: string) => {
    if (value === undefined || value === null) return "-";
    
    switch (datatype.toLowerCase()) {
      case 'float':
        return typeof value === 'number' ? value.toFixed(2) : value;
      case 'integer':
        return typeof value === 'number' ? Math.round(value) : value;
      case 'boolean':
        return value ? t('true') : t('false');
      default:
        return String(value);
    }
  };

  // Helper function to get unit for telemetry variables
  const getTelemetryUnit = (variableName: string) => {
    const variableNameLower = variableName.toLowerCase();
    
    if (variableNameLower.includes('temperature')) return '°C';
    if (variableNameLower.includes('moisture') || variableNameLower.includes('humidity')) return '%';
    if (variableNameLower.includes('pressure')) return 'hPa';
    if (variableNameLower.includes('battery')) return '%';
    if (variableNameLower.includes('signal') || variableNameLower.includes('strength')) return 'dBm';
    if (variableNameLower.includes('light')) return 'lux';
    if (variableNameLower.includes('voltage')) return 'V';
    if (variableNameLower.includes('current')) return 'A';
    if (variableNameLower.includes('power')) return 'W';
    if (variableNameLower.includes('ph')) return 'pH';
    
    return '';
  };

  return (
    <div
      style={{
        padding: isMobile ? "1rem" : "1.5rem 2rem",
        backgroundColor: darkMode ? colors.background : "transparent",
      }}
    >
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.75rem",
              padding: "0.5rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? colors.surfaceBackground
                : "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              style={{
                width: "1.25rem",
                height: "1.25rem",
                color: darkMode ? colors.textSecondary : "#4b5563",
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
          </button>
          <h1 style={titleStyle}>{sensor.name}</h1>
        </div>

        <div style={buttonGroupStyle}>
          <button
            onClick={onEdit}
            style={buttonStyle("primary")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#5d8efa"
                : "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#4d7efa"
                : "#3b82f6";
            }}
          >
            <svg
              style={{ width: "1rem", height: "1rem", marginRight: "0.375rem" }}
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
            {t("edit")}
          </button>
          <button
            onClick={onDelete}
            style={buttonStyle("danger")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#f44336"
                : "#dc2626";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#ef5350"
                : "#ef4444";
            }}
          >
            <svg
              style={{ width: "1rem", height: "1rem", marginRight: "0.375rem" }}
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
            {t("delete")}
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: darkMode ? colors.cardBackground : "white",
          borderRadius: "0.5rem",
          boxShadow: darkMode
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: `1px solid ${darkMode ? colors.border : "#e5e7eb"}`,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: darkMode ? colors.textPrimary : "#111827",
                  margin: "0 0 1rem 0",
                }}
              >
                {t("sensors.sensorInformation")}
              </h2>

              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: darkMode ? colors.textSecondary : "#6b7280",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("sensors.name")}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: darkMode ? colors.textPrimary : "#111827",
                    margin: 0,
                  }}
                >
                  {sensor.name}
                </p>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: darkMode ? colors.textSecondary : "#6b7280",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("sensors.type")}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: darkMode ? colors.textPrimary : "#111827",
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.75rem",
                      backgroundColor: darkMode
                        ? colors.infoBackground
                        : "#dbeafe",
                      color: darkMode ? colors.infoText : "#1e40af",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {sensor.type}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: darkMode ? colors.textSecondary : "#6b7280",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("status")}
                </p>
                <p style={{ fontSize: "1rem", margin: 0 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      backgroundColor: sensor.status
                        ? darkMode
                          ? colors.successBackground
                          : "#dcfce7"
                        : darkMode
                        ? colors.dangerBackground
                        : "#fee2e2",
                      color: sensor.status
                        ? darkMode
                          ? colors.successText
                          : "#166534"
                        : darkMode
                        ? colors.dangerText
                        : "#b91c1c",
                    }}
                  >
                    <span
                      style={{
                        width: "0.5rem",
                        height: "0.5rem",
                        borderRadius: "50%",
                        backgroundColor: sensor.status ? "#16a34a" : "#ef4444",
                        marginRight: "0.375rem",
                      }}
                    ></span>
                    {sensor.status ? t("active") : t("inactive")}
                  </span>
                </p>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: darkMode ? colors.textSecondary : "#6b7280",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("sensors.area")}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: darkMode ? colors.textPrimary : "#111827",
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.75rem",
                      backgroundColor: darkMode
                        ? colors.successBackground
                        : "#dcfce7",
                      color: darkMode ? colors.successText : "#166534",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {sensor.area?.name ?? (sensor.areaId != null ? String(sensor.areaId) : "-")}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: darkMode ? colors.textPrimary : "#111827",
                  margin: "0 0 1rem 0",
                }}
              >
                {t("sensors.additionalDetails")}
              </h2>

              <div style={{ marginBottom: "1rem" }}>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: darkMode ? colors.textSecondary : "#6b7280",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("description")}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: darkMode ? colors.textPrimary : "#111827",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {sensor.description || t("sensors.noDescription")}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: darkMode ? colors.textSecondary : "#6b7280",
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  {t("sensors.createdAt")}
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: darkMode ? colors.textPrimary : "#111827",
                    margin: 0,
                  }}
                >
                  {sensor.createdAt
                    ? new Date(sensor.createdAt).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          {sensor.metadata && Object.keys(sensor.metadata).length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: darkMode ? colors.textPrimary : "#111827",
                  margin: "0 0 1rem 0",
                }}
              >
                {t("metadata")}
              </h2>
              <div
                style={{
                  border: `1px solid ${darkMode ? colors.border : "#e5e7eb"}`,
                  borderRadius: "0.375rem",
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.875rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: darkMode
                          ? colors.surfaceBackground
                          : "#f9fafb",
                        borderBottom: `1px solid ${
                          darkMode ? colors.border : "#e5e7eb"
                        }`,
                      }}
                    >
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 500,
                          color: darkMode ? colors.textSecondary : "#6b7280",
                        }}
                      >
                        {t("property")}
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 500,
                          color: darkMode ? colors.textSecondary : "#6b7280",
                        }}
                      >
                        {t("value")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(sensor.metadata).map(([key, value]) => (
                      <tr
                        key={key}
                        style={{
                          borderBottom: `1px solid ${
                            darkMode ? colors.border : "#e5e7eb"
                          }`,
                        }}
                      >
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            fontWeight: 500,
                            color: darkMode ? colors.textPrimary : "#111827",
                          }}
                        >
                          {key}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: darkMode ? colors.textSecondary : "#4b5563",
                          }}
                        >
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {sensor.TelemetryData && sensor.TelemetryData.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  color: darkMode ? colors.textPrimary : '#111827', 
                  margin: 0
                }}>
                  {t('sensors.telemetryData')}
                  {connected && (
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
                
                <Link to={`/debug/socket-tester`} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: darkMode ? colors.infoBackground : '#dbeafe',
                      color: darkMode ? colors.infoText : '#1e40af',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    <svg style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('debug_socket')}
                  </button>
                </Link>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem'
              }}>
                {sensor.TelemetryData.map((variable) => {
                  const telemetryData = telemetryValues[variable.id];
                  const isNew = telemetryData?.isNew;
                  
                  return (
                    <div 
                      key={variable.id}
                      style={{ 
                        backgroundColor: darkMode ? colors.cardBackground : 'white',
                        borderRadius: '0.5rem',
                        boxShadow: isNew 
                          ? `0 0 0 2px ${darkMode ? '#4d7efa' : '#3b82f6'}, ${darkMode 
                            ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}`
                          : darkMode 
                            ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' 
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        transition: 'all 0.3s ease',
                        transform: isNew ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: darkMode ? colors.textPrimary : '#111827',
                        }}>
                          {variable.variableName.replace(/_/g, ' ')}
                        </span>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          backgroundColor: getVariableTypeColor(variable.datatype, darkMode, colors),
                          color: getVariableTypeTextColor(variable.datatype, darkMode, colors),
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                        }}>
                          {variable.datatype}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', height: '2.5rem', width: '2.5rem', flexShrink: 0 }}>
                          {getTelemetryIconForType(variable.variableName, darkMode, colors)}
                          {isNew && (
                            <div style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#16a34a',
                              boxShadow: '0 0 0 2px white',
                              animation: 'pulse 2s infinite'
                            }}></div>
                          )}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: 600, 
                            color: isNew 
                              ? darkMode ? '#4d7efa' : '#3b82f6' 
                              : darkMode ? colors.textPrimary : '#111827',
                            transition: 'color 0.3s ease',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0.25rem'
                          }}>
                            {telemetryData 
                              ? formatTelemetryValue(telemetryData.value, variable.datatype) 
                              : <span style={{ color: darkMode ? colors.textSecondary : '#6b7280', fontSize: '1rem', fontStyle: 'italic' }}>
                                  {t('sensors.waitingForData')}
                                </span>
                            }
                            {telemetryData && (
                              <span style={{ fontSize: '0.875rem', color: darkMode ? colors.textSecondary : '#6b7280', fontWeight: 500 }}>
                                {getTelemetryUnit(variable.variableName)}
                              </span>
                            )}
                          </div>
                          
                          {telemetryData?.timestamp && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: darkMode ? colors.textSecondary : '#6b7280',
                              marginTop: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {t('last_update')}: {new Date(telemetryData.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <style>
                {`
                  @keyframes pulse {
                    0% {
                      box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4);
                    }
                    70% {
                      box-shadow: 0 0 0 6px rgba(22, 163, 74, 0);
                    }
                    100% {
                      box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
                    }
                  }
                `}
              </style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for telemetry visualization
const getVariableTypeColor = (type: string, darkMode: boolean, colors: any) => {
  switch (type.toLowerCase()) {
    case 'float':
      return darkMode ? colors.infoBackground : '#dbeafe';
    case 'integer':
      return darkMode ? colors.warningBackground : '#fef3c7';
    case 'boolean':
      return darkMode ? colors.successBackground : '#dcfce7';
    case 'string':
      return darkMode ? colors.primaryBackground : '#e0e7ff';
    default:
      return darkMode ? colors.surfaceBackground : '#f3f4f6';
  }
};

const getVariableTypeTextColor = (type: string, darkMode: boolean, colors: any) => {
  switch (type.toLowerCase()) {
    case 'float':
      return darkMode ? colors.infoText : '#1e40af';
    case 'integer':
      return darkMode ? colors.warningText : '#92400e';
    case 'boolean':
      return darkMode ? colors.successText : '#166534';
    case 'string':
      return darkMode ? colors.primaryText : '#3730a3';
    default:
      return darkMode ? colors.textSecondary : '#6b7280';
  }
};

const getTelemetryIconForType = (variableName: string, darkMode: boolean, colors: any) => {
  const iconColor = darkMode ? colors.textSecondary : '#6b7280';
  const variableNameLower = variableName.toLowerCase();
  
  if (variableNameLower.includes('moisture') || variableNameLower.includes('humidity')) {
    return (
      <svg style={{ width: '2.5rem', height: '2.5rem', color: iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 12c0-4.3-3.497-8.5-7.5-8.5S4.5 7.7 4.5 12c0 6 7.5 10 7.5 10s7.5-4 7.5-10z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14a4 4 0 108 0 4 4 0 00-8 0" />
      </svg>
    );
  } else if (variableNameLower.includes('temperature')) {
    return (
      <svg style={{ width: '2.5rem', height: '2.5rem', color: iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v11m0 0a3 3 0 106 0M9 14a3 3 0 116 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v8.5M12 18.5V21" />
      </svg>
    );
  } else if (variableNameLower.includes('battery')) {
    return (
      <svg style={{ width: '2.5rem', height: '2.5rem', color: iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 6H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2zm-2 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10v4" />
      </svg>
    );
  } else if (variableNameLower.includes('signal') || variableNameLower.includes('strength')) {
    return (
      <svg style={{ width: '2.5rem', height: '2.5rem', color: iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.143 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  } else {
    return (
      <svg style={{ width: '2.5rem', height: '2.5rem', color: iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
};

export default SensorDetails;
