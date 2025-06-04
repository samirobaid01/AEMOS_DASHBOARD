import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import RuleForm from './RuleForm';
import type { RuleChainCreatePayload } from '../../types/ruleEngine';

interface RuleCreateProps {
  onSubmit: (data: RuleChainCreatePayload) => Promise<void>;
  isLoading?: boolean;
}

const RuleCreate: React.FC<RuleCreateProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '1.5rem'
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
        color: darkMode ? colors.textPrimary : '#111827'
      }}>
        {t('ruleEngine.createRuleChain')}
      </h1>
      <RuleForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default RuleCreate; 