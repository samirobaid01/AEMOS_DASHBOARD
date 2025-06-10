import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

interface DeviceState {
  id: number;
  deviceId: number;
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string;
  status: string;
}

interface Device {
  uuid: string;
  name: string;
  id: number;
  states: DeviceState[];
}

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  organizationId?: number;
  jwtToken?: string;
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
}

const ActionDialog: React.FC<ActionDialogProps> = React.memo(({
  open,
  onClose,
  onSave,
  organizationId,
  jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcxLCJlbWFpbCI6InNhbWlyYWRtaW5AeW9wbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJhcmVhLmNyZWF0ZSIsImFyZWEuZGVsZXRlIiwiYXJlYS51cGRhdGUiLCJhcmVhLnZpZXciLCJjb21tYW5kLmNhbmNlbCIsImNvbW1hbmQucmV0cnkiLCJjb21tYW5kLnNlbmQiLCJjb21tYW5kLnZpZXciLCJjb21tYW5kVHlwZS5jcmVhdGUiLCJjb21tYW5kVHlwZS5kZWxldGUiLCJjb21tYW5kVHlwZS51cGRhdGUiLCJjb21tYW5kVHlwZS52aWV3IiwiZGV2aWNlLmFuYWx5dGljcy52aWV3IiwiZGV2aWNlLmNvbnRyb2wiLCJkZXZpY2UuY3JlYXRlIiwiZGV2aWNlLmRlbGV0ZSIsImRldmljZS5oZWFydGJlYXQudmlldyIsImRldmljZS5tZXRhZGF0YS51cGRhdGUiLCJkZXZpY2Uuc3RhdHVzLnVwZGF0ZSIsImRldmljZS51cGRhdGUiLCJkZXZpY2UudmlldyIsIm1haW50ZW5hbmNlLmRlbGV0ZSIsIm1haW50ZW5hbmNlLmxvZyIsIm1haW50ZW5hbmNlLnNjaGVkdWxlIiwibWFpbnRlbmFuY2UudXBkYXRlIiwibWFpbnRlbmFuY2UudmlldyIsIm9yZ2FuaXphdGlvbi5jcmVhdGUiLCJvcmdhbml6YXRpb24uZGVsZXRlIiwib3JnYW5pemF0aW9uLnVwZGF0ZSIsIm9yZ2FuaXphdGlvbi52aWV3IiwicGVybWlzc2lvbi5tYW5hZ2UiLCJyZXBvcnQuZ2VuZXJhdGUiLCJyZXBvcnQudmlldyIsInJvbGUuYXNzaWduIiwicm9sZS52aWV3IiwicnVsZS5jcmVhdGUiLCJydWxlLmRlbGV0ZSIsInJ1bGUudXBkYXRlIiwicnVsZS52aWV3Iiwic2Vuc29yLmNyZWF0ZSIsInNlbnNvci5kZWxldGUiLCJzZW5zb3IudXBkYXRlIiwic2Vuc29yLnZpZXciLCJzZXR0aW5ncy51cGRhdGUiLCJzZXR0aW5ncy52aWV3Iiwic3RhdGUuY3JlYXRlIiwic3RhdGUudmlldyIsInN0YXRlVHJhbnNpdGlvbi5tYW5hZ2UiLCJzdGF0ZVRyYW5zaXRpb24udmlldyIsInN0YXRlVHlwZS5tYW5hZ2UiLCJzdGF0ZVR5cGUudmlldyIsInVzZXIuY3JlYXRlIiwidXNlci5kZWxldGUiLCJ1c2VyLnVwZGF0ZSIsInVzZXIudmlldyJdLCJyb2xlcyI6WyJBZG1pbiJdLCJpYXQiOjE3NDk1MzI0NjUsImV4cCI6MTc0OTYxODg2NX0.fcUWi5gGeasJj5U4pPmQpwkWyIWhmIyvAXC5qnNCLuA",
  ruleChainId,
  mode = 'add',
  initialData,
}) => {
  const [actionType, setActionType] = useState<string>('Device');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [deviceStates, setDeviceStates] = useState<DeviceState[]>([]);
  const [stateName, setStateName] = useState<string>('');
  const [stateValue, setStateValue] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [nodeName, setNodeName] = useState<string>('');
  const [allowedValues, setAllowedValues] = useState<string[]>([]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/devices?organizationId=${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const result = await response.json();
      setDevices(result.data?.devices || []);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  }, [organizationId, jwtToken]);

  useEffect(() => {
    if (open && devices.length === 0) {
      fetchDevices();
    }
  }, [open, devices.length, fetchDevices]);

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

  const fetchDeviceStates = async (deviceId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/devices/${deviceId}?organizationId=${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const result = await response.json();
      if (result.status === 'success' && result.data.device.states) {
        setDeviceStates(result.data.device.states);
      }
    } catch (error) {
      console.error('Error fetching device states:', error);
    }
  };

  const handleDeviceChange = async (deviceUuid: string) => {
    setSelectedDevice(deviceUuid);
    setStateName('');
    setStateValue('');
    setAllowedValues([]);
    
    // Find the device ID from the UUID
    const selectedDeviceObj = devices.find(d => d.uuid === deviceUuid);
    if (selectedDeviceObj?.id) {
      await fetchDeviceStates(selectedDeviceObj.id);
    }
  };

  const handleStateNameChange = (newStateName: string) => {
    setStateName(newStateName);
    setStateValue(''); // Reset state value when state name changes
    
    // Find the selected state and update allowed values
    const selectedState = deviceStates.find(state => state.stateName === newStateName);
    if (selectedState) {
      try {
        const parsedValues = JSON.parse(selectedState.allowedValues);
        setAllowedValues(parsedValues);
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
      
      console.log('Saving action node with data:', requestBody);

      const response = await fetch(
        `http://localhost:3000/api/v1/rule-chains/nodes?organizationId=${organizationId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error('Failed to save action node');
      }

      const responseData = await response.json();
      console.log('Save response:', responseData);

      if (onSave) {
        onSave(parsedOutput);
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
                  {devices.map((device) => (
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
                    {deviceStates.map((state) => (
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
                    {allowedValues.map((value) => (
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