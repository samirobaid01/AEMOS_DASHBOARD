import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import FormField from '../common/FormField';

interface RuleFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  windowWidth?: number;
}

const RuleFilter: React.FC<RuleFilterProps> = ({ 
  searchTerm, 
  onSearchChange,
  windowWidth = window.innerWidth 
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = windowWidth < 768;

  const filterContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' as const : 'row' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: darkMode ? colors.surfaceBackground : 'white',
    borderRadius: '0.5rem',
    boxShadow: darkMode 
      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)'
      : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
  };

  const inputStyle = {
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    color: darkMode ? colors.textPrimary : '#111827',
    backgroundColor: darkMode ? colors.background : 'white',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    width: '100%',
    outline: 'none',
  };

  return (
    <div style={filterContainerStyle}>
      <div style={inputGroupStyle}>
        <FormField label={t('common.search')} id="ruleSearch">
          <input
            id="ruleSearch"
            type="text"
            placeholder={t('ruleEngine.searchRule')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={inputStyle}
          />
        </FormField>
      </div>
    </div>
  );
};

export default RuleFilter; 