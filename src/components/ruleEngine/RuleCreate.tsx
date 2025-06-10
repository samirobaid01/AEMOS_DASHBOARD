import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import RuleForm from './RuleForm';
import type { RuleChainCreatePayload } from '../../types/ruleEngine';
import { Button, Box } from '@mui/material';

interface RuleCreateProps {
  onSubmit: (data: RuleChainCreatePayload) => Promise<void>;
  onFinish: () => void;
  isLoading?: boolean;
  ruleChainId: number | null;
  showNodeSection: boolean;
}

const RuleCreate: React.FC<RuleCreateProps> = ({ 
  onSubmit, 
  onFinish,
  isLoading, 
  ruleChainId,
  showNodeSection 
}) => {
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
        {showNodeSection ? t('ruleEngine.addNodes') : t('ruleEngine.createRuleChain')}
      </h1>
      <RuleForm 
        onSubmit={onSubmit} 
        isLoading={isLoading} 
        ruleChainId={ruleChainId || undefined}
        showNodeSection={showNodeSection}
      />
      {showNodeSection && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={onFinish}
            fullWidth
          >
            {t('ruleEngine.finish')}
          </Button>
        </Box>
      )}
    </div>
  );
};

export default RuleCreate; 