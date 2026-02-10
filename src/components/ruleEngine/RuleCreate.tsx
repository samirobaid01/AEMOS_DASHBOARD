import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import RuleForm from './RuleForm';
import type { RuleChainCreatePayload, RuleChainUpdatePayload } from '../../types/ruleEngine';
import { Button, Box } from '@mui/material';
import type { Sensor } from '../../types/sensor';
import type { Device } from '../../types/device';
import type { DeviceStateRecord } from '../../types/device';

interface RuleCreateProps {
  onSubmit: (data: RuleChainCreatePayload | RuleChainUpdatePayload) => Promise<void>;
  onFinish: () => void;
  isLoading?: boolean;
  ruleChainId: number | null;
  showNodeSection: boolean;
  onNodeDelete: (nodeId: number) => Promise<void>;
  onNodeCreate: (data: any) => Promise<void>;
  onNodeUpdate: (nodeId: number, data: any) => Promise<void>;
  sensors: Sensor[];
  devices: Device[];
  deviceStates: DeviceStateRecord[];
  lastFetchedDeviceId: number | null;
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

const RuleCreate: React.FC<RuleCreateProps> = ({ 
  onSubmit, 
  onFinish,
  isLoading, 
  ruleChainId,
  showNodeSection,
  onNodeDelete,
  onNodeCreate,
  onNodeUpdate,
  sensors,
  devices,
  deviceStates,
  lastFetchedDeviceId,
  sensorDetails,
  onFetchSensorDetails,
  onFetchDeviceStates
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
        onNodeDelete={onNodeDelete}
        onNodeCreate={onNodeCreate}
        onNodeUpdate={onNodeUpdate}
        sensors={sensors}
        devices={devices}
        deviceStates={deviceStates}
        lastFetchedDeviceId={lastFetchedDeviceId}
        sensorDetails={sensorDetails}
        onFetchSensorDetails={onFetchSensorDetails}
        onFetchDeviceStates={onFetchDeviceStates}
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