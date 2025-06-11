import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from '@mui/material';
import type { Device, DeviceState } from '../../types/device';

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  ruleChainId: number;
  mode?: 'add' | 'edit';
  initialData?: {
    type: 'action';
    name?: string;
    config: {
      type: 'DEVICE_COMMAND';
      command: {
        deviceUuid: string;
        stateName: string;
        value: string;
        initiatedBy: 'device';
      };
    };
  };
  devices: Device[];
  deviceStates: DeviceState[];
  onFetchDeviceStates: (deviceId: number) => Promise<void>;
}

const ActionDialog: React.FC<ActionDialogProps> = React.memo(({
  open,
  onClose,
  onSave,
  ruleChainId,
  mode = 'add',
  initialData,
  devices = [],
  deviceStates = [],
  onFetchDeviceStates,
}) => {
  const [actionType, setActionType] = useState<string>('Device');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');
  const [stateValue, setStateValue] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [nodeName, setNodeName] = useState<string>('');
  const [allowedValues, setAllowedValues] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (mode === 'add') {
        setActionType('Device');
        setSelectedDevice('');
        setStateName('');
        setStateValue('');
        setJsonOutput('');
        setNodeName('');
      } else if (mode === 'edit' && initialData) {
        try {
          if (initialData.type === 'action' && initialData.config.command) {
            const { command } = initialData.config;
            setActionType('Device');
            setSelectedDevice(command.deviceUuid || '');
            setStateName(command.stateName || '');
            setStateValue(command.value || '');
            setNodeName(initialData.name || '');
            setJsonOutput(JSON.stringify({
              type: 'action',
              config: {
                type: 'DEVICE_COMMAND',
                command: {
                  deviceUuid: command.deviceUuid,
                  stateName: command.stateName,
                  value: command.value,
                  initiatedBy: 'device'
                }
              }
            }, null, 2));
          }
        } catch (error) {
          console.error('Error parsing initialData:', error);
        }
      }
    }
  }, [open, mode, initialData]);

  const handleDeviceChange = async (deviceUuid: string) => {
    setSelectedDevice(deviceUuid);
    setStateName('');
    setStateValue('');
    setAllowedValues([]);
    
    // Find the device ID from the UUID
    const selectedDeviceObj = devices.find(d => d.uuid === deviceUuid);
    if (selectedDeviceObj?.id) {
      await onFetchDeviceStates(selectedDeviceObj.id);
    }
  };

  const handleStateNameChange = (newStateName: string) => {
    setStateName(newStateName);
    setStateValue(''); // Reset state value when state name changes
    
    // Add null check before finding state
    const selectedState = deviceStates?.find(state => state.stateName === newStateName);
    if (selectedState) {
      try {
        const parsedValues = JSON.parse(selectedState.allowedValues);
        setAllowedValues(Array.isArray(parsedValues) ? parsedValues : []);
      } catch (error) {
        console.error('Error parsing allowed values:', error);
        setAllowedValues([]);
      }
    }
  };

  useEffect(() => {
    if (actionType === 'Device' && selectedDevice && stateName && stateValue) {
      const outputData = {
        type: 'action',
        config: {
          type: 'DEVICE_COMMAND',
          command: {
            deviceUuid: selectedDevice,
            stateName: stateName,
            value: stateValue,
            initiatedBy: 'device'
          }
        }
      };
      setJsonOutput(JSON.stringify(outputData, null, 2));
    } else if (mode !== 'edit') {
      setJsonOutput('');
    }
  }, [actionType, selectedDevice, stateName, stateValue, mode]);

  const handleSave = async () => {
    if (!jsonOutput || !nodeName.trim()) return;

    try {
      const parsedOutput = JSON.parse(jsonOutput);
      const requestBody = {
        ruleChainId,
        type: 'action',
        name: nodeName.trim(),
        config: JSON.stringify(parsedOutput.config),
        nextNodeId: null,
      };

      if (onSave) {
        onSave(requestBody);
      }
      onClose();
    } catch (error) {
      console.error('Error saving action node:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'edit' ? 'Edit Action' : 'Add Action'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Node Name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
            error={!nodeName.trim()}
            helperText={!nodeName.trim() ? "Node name is required" : ""}
          />

          <FormControl fullWidth>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              label="Action Type"
            >
              <MenuItem value="Device">Device</MenuItem>
              <MenuItem value="Notification">Notification</MenuItem>
              <MenuItem value="Email">Email</MenuItem>
            </Select>
          </FormControl>

          {actionType === 'Device' && (
            <>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select
                  value={selectedDevice}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  label="Device"
                >
                  {(devices || []).map((device) => (
                    <MenuItem key={device.uuid} value={device.uuid}>
                      {device.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedDevice && (
                <FormControl fullWidth>
                  <InputLabel>Device State</InputLabel>
                  <Select
                    value={stateName}
                    onChange={(e) => handleStateNameChange(e.target.value)}
                    label="Device State"
                  >
                    {(deviceStates || []).map((state) => (
                      <MenuItem key={state.id} value={state.stateName}>
                        {state.stateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {stateName && (
                <FormControl fullWidth>
                  <InputLabel>State Value</InputLabel>
                  <Select
                    value={stateValue}
                    onChange={(e) => setStateValue(e.target.value)}
                    label="State Value"
                  >
                    {(allowedValues || []).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          {jsonOutput && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Action Configuration:
              </Typography>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {jsonOutput}
              </pre>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!jsonOutput || !nodeName.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.mode === nextProps.mode &&
    prevProps.ruleChainId === nextProps.ruleChainId &&
    JSON.stringify(prevProps.initialData) === JSON.stringify(nextProps.initialData)
  );
});

export default ActionDialog; 