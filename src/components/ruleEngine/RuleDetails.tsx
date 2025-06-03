import React from 'react';
import type { RuleChain } from '../../types/ruleEngine';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from 'react-i18next';

interface RuleDetailsProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  windowWidth?: number;
}

const RuleDetails: React.FC<RuleDetailsProps> = ({ 
  rule, 
  isLoading, 
  error,
  onBack,
  onEdit,
  onDelete,
  windowWidth = window.innerWidth
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const containerStyle = {
    padding: isMobile ? '1rem' : '1.5rem 2rem',
    backgroundColor: darkMode ? colors.background : 'transparent',
  };

  const cardStyle = {
    backgroundColor: darkMode ? colors.cardBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    padding: isMobile ? '1rem' : '1.5rem',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    marginBottom: '1.5rem',
    gap: isMobile ? '1rem' : '0',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    margin: 0,
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
        ? darkMode ? '#4d7efa' : '#3b82f6'
        : variant === 'danger'
        ? darkMode ? '#ef5350' : '#ef4444'
        : darkMode ? colors.surfaceBackground : 'white',
    color:
      variant === 'secondary'
        ? darkMode ? colors.textSecondary : '#4b5563'
        : 'white',
    border: variant === 'secondary'
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
  });

  const dividerStyle = {
    height: '1px',
    backgroundColor: darkMode ? colors.border : '#e5e7eb',
    margin: '1.5rem 0',
  };

  const sectionStyle = {
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#6b7280',
    marginBottom: '0.25rem',
  };

  const valueStyle = {
    fontSize: '1rem',
    color: darkMode ? colors.textPrimary : '#111827',
    margin: '0',
  };

  const codeBlockStyle = {
    backgroundColor: darkMode ? colors.surfaceBackground : '#f3f4f6',
    borderRadius: '0.375rem',
    padding: '1rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    overflowX: 'auto' as const,
    color: darkMode ? colors.textPrimary : '#111827',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: `4px solid ${darkMode ? '#4d7efa' : '#3b82f6'}`,
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <p style={{
          color: darkMode ? colors.dangerText : '#dc2626',
          margin: '1rem 0',
        }}>
          {error}
        </p>
      </div>
    );
  }

  if (!rule) {
    return (
      <div style={containerStyle}>
        <p style={{
          color: darkMode ? colors.textSecondary : '#6b7280',
          margin: '1rem 0',
        }}>
          {t('rules.notFound')}
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                borderRadius: '0.375rem',
                color: darkMode ? colors.textSecondary : '#6b7280',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? colors.surfaceBackground : '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <h1 style={titleStyle}>{rule.name}</h1>
        </div>

        {(onEdit || onDelete) && (
          <div style={buttonGroupStyle}>
            {onEdit && (
              <button
                onClick={onEdit}
                style={buttonStyle('primary')}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#5d8efa' : '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#4d7efa' : '#3b82f6';
                }}
              >
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('common.edit')}
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                style={buttonStyle('danger')}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#f44336' : '#dc2626';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#ef5350' : '#ef4444';
                }}
              >
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.375rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('common.delete')}
              </button>
            )}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>{t('common.description')}</p>
          <p style={valueStyle}>{rule.description}</p>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>{t('common.createdAt')}</p>
          <p style={valueStyle}>{formatDate(rule.createdAt)}</p>

          <p style={{ ...labelStyle, marginTop: '1rem' }}>{t('common.lastUpdated')}</p>
          <p style={valueStyle}>{formatDate(rule.updatedAt)}</p>
        </div>

        <div style={dividerStyle} />

        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            margin: '0 0 1rem 0',
          }}>
            {t('ruleEngine.ruleNode.title')}
          </h2>

          {rule?.nodes?.length === 0 ? (
            <p style={{
              color: darkMode ? colors.textSecondary : '#6b7280',
              margin: '1rem 0',
            }}>
              {t('rules.noNodes')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rule?.nodes?.map((node, index) => (
                <div
                  key={node.id}
                  style={{
                    ...cardStyle,
                    padding: '1rem',
                    marginBottom: index < rule.nodes.length - 1 ? '1rem' : 0,
                  }}
                >
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: darkMode ? colors.textPrimary : '#111827',
                    margin: '0 0 0.5rem 0',
                  }}>
                    {node.type.charAt(0).toUpperCase() + node.type.slice(1)} {t('rules.node')}
                  </h3>

                  <p style={labelStyle}>{t('rules.configuration')}:</p>
                  <pre style={codeBlockStyle}>
                    {JSON.stringify(JSON.parse(node.config), null, 2)}
                  </pre>

                  {node.nextNodeId && (
                    <p style={{
                      ...labelStyle,
                      marginTop: '0.5rem',
                      marginBottom: 0,
                    }}>
                      {t('rules.nextNode')}: {node.nextNodeId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleDetails; 