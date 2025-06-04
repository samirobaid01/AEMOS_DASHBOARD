import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import RuleForm from './RuleForm';
import type { RuleChain, RuleChainUpdatePayload } from '../../types/ruleEngine';

interface RuleEditProps {
  rule: RuleChain | null;
  isLoading: boolean;
  error?: string | null;
  onSubmit: (data: RuleChainUpdatePayload) => Promise<void>;
  windowWidth?: number;
}

const RuleEdit: React.FC<RuleEditProps> = ({
  rule,
  isLoading,
  error,
  onSubmit,
  windowWidth = window.innerWidth
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: isMobile ? '1rem' : '1.5rem',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: darkMode ? colors.textPrimary : '#111827',
    marginBottom: '1.5rem',
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
      <h1 style={titleStyle}>
        {t('rules.edit')}: {rule.name}
      </h1>
      <RuleForm
        initialData={rule}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RuleEdit; 