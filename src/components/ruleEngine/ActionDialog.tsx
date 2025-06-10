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

interface Device {
  uuid: string;
  name: string;
  capabilities: Record<string, any>;
}

interface DeviceState {
  key: string;
  values: string[] | null;
  range?: [number, number];
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
  organizationId = 1,
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
      } else if (mode === 'edit' && initialData) {
        try {
          if (initialData.type === 'action' && initialData.config.command) {
            const { command } = initialData.config;
            setActionType('Device');
            setSelectedDevice(command.deviceUuid || '');
            setStateName(command.stateName || '');
            setStateValue(command.value || '');
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

  const currentDeviceStates = useMemo(() => {
    if (selectedDevice) {
      const device = devices.find(d => d.uuid === selectedDevice);
      if (device) {
        const states: DeviceState[] = [];
        Object.entries(device.capabilities || {}).forEach(([key, value]) => {
          if (key.includes("Range") && Array.isArray(value) && value.length === 2) {
            states.push({
              key: key.replace("Range", ""),
              values: null,
              range: value as [number, number],
            });
          } else if (Array.isArray(value)) {
            states.push({
              key: key.replace(/([A-Z])/g, "_$1").toLowerCase(),
              values: value,
            });
          } else if (typeof value === "boolean") {
            states.push({
              key: key.replace(/([A-Z])/g, "_$1").toLowerCase(),
              values: ["true", "false"],
            });
          }
        });
        return states;
      }
    }
    return [];
  }, [selectedDevice, devices]);

  useEffect(() => {
    setDeviceStates(currentDeviceStates);
  }, [currentDeviceStates]);

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
    if (!jsonOutput) return;

    try {
      const requestBody = {
        ruleChainId: ruleChainId,
        type: 'action',
        config: jsonOutput,
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
        onSave(JSON.parse(jsonOutput));
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

          {actionType === 'Device' ? (
            <>
              <FormControl fullWidth>
                <InputLabel>Device</InputLabel>
                <Select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
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
                    onChange={(e) => setStateName(e.target.value)}
                    label="Device State"
                  >
                    {deviceStates.map((state) => (
                      <MenuItem key={state.key} value={state.key}>
                        {state.key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {stateName && (
                <TextField
                  fullWidth
                  label="State Value"
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                  helperText={
                    deviceStates.find(s => s.key === stateName)?.range 
                      ? `Range: ${deviceStates.find(s => s.key === stateName)?.range?.join(' - ')}`
                      : deviceStates.find(s => s.key === stateName)?.values?.join(', ')
                  }
                />
              )}
            </>
          ) : (
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              This feature is not available yet
            </Typography>
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
          disabled={!jsonOutput}
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