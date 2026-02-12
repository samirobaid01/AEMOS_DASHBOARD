import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Device } from '../../types/device';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import FormField from '../common/FormField';
import type { ActionDialogProps } from './types';

const inputClasses =
  'w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';

const ActionDialog: React.FC<ActionDialogProps> = React.memo(({
  open,
  onClose,
  onSave,
  ruleChainId,
  mode = 'add',
  initialData,
  devices = [],
  deviceStates = [],
  lastFetchedDeviceId = null,
  onFetchDeviceStates,
}) => {
  const [actionType, setActionType] = useState<string>('Device');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [stateName, setStateName] = useState<string>('');
  const [stateValue, setStateValue] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [nodeName, setNodeName] = useState<string>('');
  const [allowedValues, setAllowedValues] = useState<string[]>([]);
  const [isLoadingDeviceStates, setIsLoadingDeviceStates] = useState<boolean>(false);
  const prevOpenRef = useRef(false);

  const getDeviceValue = (device: Device) => device.uuid ?? `id:${device.id}`;
  const getDeviceByValue = (value: string): Device | undefined => {
    if (value.startsWith('id:')) {
      const id = Number(value.slice(3));
      return devices.find((d) => d.id === id);
    }
    return devices.find((d) => d.uuid === value);
  };

  useEffect(() => {
    const justOpened = open && !prevOpenRef.current;
    prevOpenRef.current = open;

    if (!open) return;

    if (justOpened) {
      if (mode === 'add') {
        setActionType('Device');
        setSelectedDevice('');
        setStateName('');
        setStateValue('');
        setJsonOutput('');
        setNodeName('');
        setAllowedValues([]);
        setIsLoadingDeviceStates(false);
      } else if (mode === 'edit' && initialData) {
        try {
          if (initialData.type === 'action' && initialData.config.command) {
            const { command } = initialData.config;
            setActionType('Device');
            setSelectedDevice(command.deviceUuid || '');
            setStateName(command.stateName || '');
            setStateValue(command.value || '');
            setNodeName(initialData.name || '');
            setAllowedValues([]);
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
            if (command.deviceUuid) {
              const selectedDeviceObj = devices.find((d) => d.uuid === command.deviceUuid);
              if (selectedDeviceObj?.id) {
                setIsLoadingDeviceStates(true);
                onFetchDeviceStates(selectedDeviceObj.id).finally(() => {
                  setIsLoadingDeviceStates(false);
                });
              }
            }
          }
        } catch (error) {
          console.error('Error parsing initialData:', error);
        }
      }
    }
  }, [open, mode, initialData, devices, onFetchDeviceStates]);

  const handleDeviceChange = async (value: string) => {
    setSelectedDevice(value);
    setStateName('');
    setStateValue('');
    setAllowedValues([]);
    const selectedDeviceObj = getDeviceByValue(value);
    if (selectedDeviceObj?.id) {
      try {
        setIsLoadingDeviceStates(true);
        await onFetchDeviceStates(selectedDeviceObj.id);
      } catch (error) {
        console.error('Error fetching device states:', error);
      } finally {
        setIsLoadingDeviceStates(false);
      }
    }
  };

  const handleStateNameChange = (newStateName: string) => {
    setStateName(newStateName);
    const selectedState = filteredDeviceStates?.find(state => state.stateName === newStateName);
    if (selectedState) {
      const values = Array.isArray(selectedState.allowedValues) ? selectedState.allowedValues : [];
      setAllowedValues(values);
      setStateValue(values.length === 1 ? values[0] : '');
    } else {
      setAllowedValues([]);
      setStateValue('');
    }
  };

  useEffect(() => {
    if (actionType === 'Device' && selectedDevice && stateName && stateValue) {
      const dev = getDeviceByValue(selectedDevice);
      const deviceUuid = dev?.uuid ?? (selectedDevice.startsWith('id:') ? '' : selectedDevice);
      const outputData = {
        type: 'action',
        config: {
          type: 'DEVICE_COMMAND',
          command: {
            deviceUuid: deviceUuid,
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
        type: 'action' as const,
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

  const filteredDeviceStates = useMemo(() => {
    if (!selectedDevice) return [];
    if (!devices.length) return [];
    if (!deviceStates.length) return [];
    const selectedDeviceObj = getDeviceByValue(selectedDevice);
    if (!selectedDeviceObj) return [];
    if (lastFetchedDeviceId == null || selectedDeviceObj.id !== lastFetchedDeviceId) return [];
    return deviceStates;
  }, [selectedDevice, devices, deviceStates, lastFetchedDeviceId]);

  const deviceOptions = useMemo(() => {
    return (devices || []).filter((d) => d.uuid != null || d.id != null);
  }, [devices]);

  const deviceStateSelectValue =
    !isLoadingDeviceStates &&
    filteredDeviceStates.length > 0 &&
    filteredDeviceStates.some((s) => s.stateName === stateName)
      ? stateName
      : '';
  const stateValueSelectValue =
    stateValue && (allowedValues || []).includes(stateValue) ? stateValue : '';

  useEffect(() => {
    if (mode !== 'edit' || !stateName || filteredDeviceStates.length === 0) return;
    const state = filteredDeviceStates.find((s) => s.stateName === stateName);
    if (!state) return;
    const raw = state.allowedValues;
    const next =
      Array.isArray(raw)
        ? raw
        : typeof raw === 'string'
          ? (() => {
              try {
                return JSON.parse(raw) as string[];
              } catch {
                return [];
              }
            })()
          : [];
    setAllowedValues(next);
  }, [mode, stateName, filteredDeviceStates]);

  if (!open) return null;

  const footer = (
    <>
      <Button type="button" variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        onClick={handleSave}
        disabled={!jsonOutput || !nodeName.trim()}
      >
        Save
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Action' : 'Add Action'}
      footer={footer}
      size="xl"
    >
      <div className="flex flex-col gap-4 min-h-[520px] max-h-[70vh] overflow-y-auto pr-1">
        <FormField label="Node Name" id="action-node-name" required>
          <input
            id="action-node-name"
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className={inputClasses}
          />
          {!nodeName.trim() && (
            <p className="mt-1 text-sm text-danger dark:text-danger-dark">Node name is required</p>
          )}
        </FormField>

        <FormField label="Action Type" id="action-type">
          <select
            id="action-type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className={selectClasses}
          >
            <option value="Device">Device</option>
            <option value="Notification">Notification</option>
            <option value="Email">Email</option>
          </select>
        </FormField>

        {actionType === 'Device' && (
          <>
            <FormField label="Device" id="action-device">
              <select
                id="action-device"
                value={selectedDevice}
                onChange={(e) => handleDeviceChange(e.target.value)}
                className={selectClasses}
                aria-label="Select device"
              >
                <option value="">Select device</option>
                {deviceOptions.map((device) => (
                  <option key={device.id} value={getDeviceValue(device)}>
                    {device.name}
                  </option>
                ))}
              </select>
            </FormField>

            {selectedDevice && (
              <>
                <FormField label="Device State" id="action-device-state">
                  <select
                    id="action-device-state"
                    value={deviceStateSelectValue}
                    onChange={(e) => handleStateNameChange(e.target.value)}
                    disabled={isLoadingDeviceStates}
                    className={selectClasses}
                    aria-label="Select device state"
                  >
                    {isLoadingDeviceStates ? (
                      <option value="">Loading device states...</option>
                    ) : filteredDeviceStates.length === 0 ? (
                      <option value="">No device states available</option>
                    ) : (
                      <>
                        <option value="">Select device state</option>
                        {filteredDeviceStates.map((state) => (
                          <option key={state.id} value={state.stateName}>
                            {state.stateName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </FormField>

                <FormField label="State Value" id="action-state-value">
                  <select
                    id="action-state-value"
                    value={stateValueSelectValue}
                    onChange={(e) => setStateValue(e.target.value)}
                    disabled={!stateName}
                    className={selectClasses}
                    aria-label="Select state value"
                    title={!stateName ? 'Select a device state first' : undefined}
                  >
                    <option value="">
                      {stateName ? 'Select value' : 'Select device state first'}
                    </option>
                    {(allowedValues || []).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormField>
              </>
            )}
          </>
        )}

        {jsonOutput && (
          <div className="mt-2 p-4 rounded border border-border dark:border-border-dark bg-card dark:bg-card-dark">
            <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2 m-0">
              Action Configuration:
            </p>
            <pre className="m-0 whitespace-pre-wrap text-sm text-textPrimary dark:text-textPrimary-dark">
              {jsonOutput}
            </pre>
          </div>
        )}
      </div>
    </Modal>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.mode === nextProps.mode &&
    prevProps.ruleChainId === nextProps.ruleChainId &&
    prevProps.lastFetchedDeviceId === nextProps.lastFetchedDeviceId &&
    prevProps.devices.length === nextProps.devices.length &&
    prevProps.deviceStates.length === nextProps.deviceStates.length &&
    JSON.stringify(prevProps.initialData) === JSON.stringify(nextProps.initialData)
  );
});

export default ActionDialog;
