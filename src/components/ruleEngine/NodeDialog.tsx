import React, { useState, useEffect, useRef } from "react";
import type { Device } from "../../types/device";
import type { Sensor } from "../../types/sensor";
import * as deviceStatesService from '../../services/deviceStates.service';
import { useAppSelector } from '../../state/store';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import Modal from '../common/Modal/Modal';
import Button from '../common/Button/Button';
import FormField from '../common/FormField';

const inputClasses =
  'block w-full min-w-0 px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'block w-full min-w-0 px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';

interface ConditionData {
  sourceType: 'sensor' | 'device';
  UUID: string;
  key: string;
  operator: string;
  value: string | number | number[] | string[];
  duration?: string | number;
}

interface GroupData {
  type: 'AND' | 'OR';
  expressions: Array<ConditionData | GroupData>;
}

interface ParsedExpression {
  sourceType?: string;
  UUID?: string;
  key?: string;
  operator?: string;
  value?: string | number | number[] | string[];
  duration?: string | number;
  type?: string;
  expressions?: ParsedExpression[];
}

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  onUpdate?: (nodeId: number, data: any) => void;
  ruleChainId?: number;
  mode: 'add' | 'edit';
  initialExpression?: {
    id?: number;
    name?: string;
    type: 'filter' | 'action';
    sourceType?: string;
    UUID?: string;
    key?: string;
    operator?: string;
    value?: string | number;
    duration?: string | number;
    config?: string;
  };
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}

const OPERATORS = [
  // Basic comparisons
  { value: "==", label: "Equals", category: "comparison", valueType: "single" },
  { value: "!=", label: "Not Equals", category: "comparison", valueType: "single" },
  { value: ">", label: "Greater Than", category: "comparison", valueType: "single" },
  { value: "<", label: "Less Than", category: "comparison", valueType: "single" },
  { value: ">=", label: "Greater Than or Equal", category: "comparison", valueType: "single" },
  { value: "<=", label: "Less Than or Equal", category: "comparison", valueType: "single" },
  
  // Null/Empty checks
  { value: "isNull", label: "Is Null", category: "null", valueType: "none" },
  { value: "isNotNull", label: "Is Not Null", category: "null", valueType: "none" },
  { value: "isEmpty", label: "Is Empty", category: "null", valueType: "none" },
  { value: "isNotEmpty", label: "Is Not Empty", category: "null", valueType: "none" },
  
  // Type checks
  { value: "isNumber", label: "Is Number", category: "type", valueType: "none" },
  { value: "isString", label: "Is String", category: "type", valueType: "none" },
  { value: "isBoolean", label: "Is Boolean", category: "type", valueType: "none" },
  { value: "isArray", label: "Is Array", category: "type", valueType: "none" },
  
  // Numeric operations
  { value: "between", label: "Between", category: "numeric", valueType: "range" },
  
  // String operations
  { value: "contains", label: "Contains", category: "string", valueType: "single" },
  { value: "notContains", label: "Not Contains", category: "string", valueType: "single" },
  { value: "startsWith", label: "Starts With", category: "string", valueType: "single" },
  { value: "endsWith", label: "Ends With", category: "string", valueType: "single" },
  { value: "matches", label: "Matches Regex", category: "string", valueType: "single" },
  
  // Array operations
  { value: "in", label: "In", category: "array", valueType: "array" },
  { value: "notIn", label: "Not In", category: "array", valueType: "array" },
  { value: "hasAll", label: "Has All", category: "array", valueType: "array" },
  { value: "hasAny", label: "Has Any", category: "array", valueType: "array" },
  { value: "hasNone", label: "Has None", category: "array", valueType: "array" },
  
  // Time operations
  { value: "olderThan", label: "Older Than (s|m|h|d)", category: "time", valueType: "singleDuration" },
  { value: "newerThan", label: "Newer Than (s|m|h|d)", category: "time", valueType: "singleDuration" },
  { value: "inLast", label: "In Last (s|m|h|d)", category: "time", valueType: "singleDuration" },

  //Time operations with value to compare with
  { value: "valueOlderThan", label: "Value Older Than (s|m|h|d)", category: "timeValue", valueType: "compareValueDuration" },
  { value: "valueNewerThan", label: "Value Newer Than (s|m|h|d)", category: "timeValue", valueType: "compareValueDuration" },
  { value: "valueInLast", label: "Value In Last (s|m|h|d)", category: "timeValue", valueType: "compareValueDuration" },
];

// Helper function to get operator configuration
const getOperatorConfig = (operatorValue: string) => {
  return OPERATORS.find(op => op.value === operatorValue) || { value: operatorValue, label: operatorValue, category: "comparison", valueType: "single" };
};

// Value Input Component for different operator types
const ValueInput: React.FC<{
  operator: string;
  value: string | number | number[] | string[];
  duration?: string | number;
  onChange: (value: string | number | number[] | string[]) => void;
  onDurationChange?: (duration: string | number) => void;
}> = ({ operator, value, duration, onChange, onDurationChange }) => {
  const operatorConfig = getOperatorConfig(operator);

  const handleSingleValueChange = (newValue: string) => {
    // Try to convert to number if it looks like a number
    const numberValue = Number(newValue);
    if (!isNaN(numberValue) && newValue.trim() !== '') {
      onChange(numberValue);
    } else {
      onChange(newValue);
    }
  };

  const handleRangeValueChange = (index: 0 | 1, newValue: string) => {
    const currentValue = Array.isArray(value) ? value as number[] : [0, 0];
    const numberValue = Number(newValue);
    const newRangeValue: number[] = [...currentValue];
    newRangeValue[index] = !isNaN(numberValue) ? numberValue : 0;
    onChange(newRangeValue);
  };

  const handleArrayValueChange = (newValue: string) => {
    // Parse comma-separated values, keeping them as strings or converting to numbers
    const arrayValue = newValue.split(',').map(item => {
      const trimmed = item.trim();
      const numberValue = Number(trimmed);
      // Only convert to number if it's a valid number and not an empty string
      return !isNaN(numberValue) && trimmed !== '' && trimmed !== '.' ? numberValue : trimmed;
    }).filter(item => item !== '');
    
    // Determine if this should be a string array or number array
    const hasNumbers = arrayValue.some(item => typeof item === 'number');
    const hasStrings = arrayValue.some(item => typeof item === 'string' && item !== '');
    
    if (hasNumbers && !hasStrings) {
      // All numbers
      onChange(arrayValue.filter((item): item is number => typeof item === 'number'));
    } else {
      // Mixed or all strings - convert all to strings
      onChange(arrayValue.map(item => String(item)));
    }
  };

  switch (operatorConfig.valueType) {
    case 'none':
      return null; // No input needed for operators like isNull, isNumber, etc.

    case 'range': {
      const rangeValue = Array.isArray(value) ? value : [0, 0];
      return (
        <div className="flex gap-2 items-center min-w-[200px]">
          <FormField label="Min" id="value-min">
            <input
              type="number"
              className={inputClasses}
              value={rangeValue[0] ?? ''}
              onChange={(e) => handleRangeValueChange(0, e.target.value)}
            />
          </FormField>
          <span className="text-sm text-textSecondary dark:text-textSecondary-dark">to</span>
          <FormField label="Max" id="value-max">
            <input
              type="number"
              className={inputClasses}
              value={rangeValue[1] ?? ''}
              onChange={(e) => handleRangeValueChange(1, e.target.value)}
            />
          </FormField>
        </div>
      );
    }

    case 'array': {
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value || '');
      return (
        <FormField label="Values (comma-separated)" id="value-array">
          <input
            type="text"
            className={inputClasses}
            value={displayValue}
            onChange={(e) => handleArrayValueChange(e.target.value)}
            placeholder="value1, value2, value3"
          />
          <p className="mt-1 text-xs text-textMuted dark:text-textMuted-dark">Enter values separated by commas</p>
        </FormField>
      );
    }

    case 'singleDuration':
      return (
        <FormField label="30s | 1m | 1h | 1d" id="value-duration">
          <input
            type="text"
            className={inputClasses}
            value={Array.isArray(value) ? value.join(', ') : String(value || '')}
            onChange={(e) => handleSingleValueChange(e.target.value)}
            placeholder={operatorConfig.category === 'string' ? 'Enter text' : 'Enter value'}
          />
        </FormField>
      );
    case 'compareValueDuration':
      return (
        <div className="flex gap-2 items-center min-w-[200px]">
          <FormField label="Duration (30s | 1m | 1h | 1d)" id="duration-compare">
            <input
              type="text"
              className={inputClasses}
              value={duration ?? ''}
              onChange={(e) => onDurationChange?.(e.target.value)}
              placeholder="Enter duration"
            />
          </FormField>
          <FormField label="Value" id="value-compare">
            <input
              type="text"
              className={inputClasses}
              value={Array.isArray(value) ? value.join(', ') : String(value || '')}
              onChange={(e) => handleSingleValueChange(e.target.value)}
              placeholder="Enter value"
            />
          </FormField>
        </div>
      );
    default:
      return (
        <FormField label="Value" id="value-single">
          <input
            type="text"
            className={inputClasses}
            value={Array.isArray(value) ? value.join(', ') : String(value || '')}
            onChange={(e) => handleSingleValueChange(e.target.value)}
            placeholder={operatorConfig.category === 'string' ? 'Enter text' : 'Enter value'}
          />
        </FormField>
      );
  }
};

// Function to optimize the structure by removing unnecessary single-expression groups
const optimizeStructure = (data: GroupData | ConditionData, isRoot: boolean = true): any => {
  // If it's a condition, return it as-is
  if ('sourceType' in data) {
    return data;
  }
  
  // Only flatten single-expression groups at the ROOT level
  if (isRoot && data.expressions.length === 1) {
    // Recursively optimize the single expression (but it's no longer root)
    return optimizeStructure(data.expressions[0], false);
  }
  
  // For nested groups OR multiple expressions, keep the group but optimize nested expressions
  if (data.expressions.length >= 1) {
    return {
      type: data.type,
      expressions: data.expressions.map(expr => optimizeStructure(expr, false))
    };
  }
  
  // If no expressions, return null (this shouldn't happen in normal usage)
  return null;
};

const ConditionBuilder: React.FC<{
  condition: ConditionData;
  onChange: (newCondition: ConditionData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}> = ({ condition, onChange, onDelete, sensors, devices, sensorDetails, onFetchSensorDetails }) => {
  const [isLoadingSensorDetails, setIsLoadingSensorDetails] = useState(false);
  const [isLoadingDeviceStates, setIsLoadingDeviceStates] = useState(false);
  const [deviceStates, setDeviceStates] = useState<any[]>([]);
  const lastFetchTime = useRef<number>(0);
  const organizationId = useAppSelector(selectSelectedOrganizationId);

  // Load sensor details when UUID changes or when sensors/devices update
  useEffect(() => {
    const loadSensorDetails = async () => {
      if (condition.sourceType === 'sensor' && condition.UUID) {
        const sensor = sensors.find(s => s.uuid === condition.UUID);
        if (sensor && !sensorDetails[condition.UUID]) {
          const now = Date.now();
          // Only fetch if more than 300ms has passed since last fetch
          if (now - lastFetchTime.current > 300) {
            setIsLoadingSensorDetails(true);
            try {
              lastFetchTime.current = now;
              await onFetchSensorDetails(sensor.id);
            } catch (error) {
              console.error('Error fetching sensor details:', error);
            } finally {
              setIsLoadingSensorDetails(false);
            }
          }
        }
      }
    };

    loadSensorDetails();
  }, [condition.UUID, condition.sourceType, sensors, devices, sensorDetails, onFetchSensorDetails]);

  // Fetch device states when a device is selected
  useEffect(() => {
    const fetchDeviceStatesForDevice = async () => {
      if (condition.sourceType === 'device' && condition.UUID && organizationId) {
        const device = devices.find(d => d.uuid === condition.UUID);
        if (device?.id) {
          setIsLoadingDeviceStates(true);
          try {
            const states = await deviceStatesService.getDeviceStates(device.id, organizationId);
            setDeviceStates(states || []);
          } catch (error) {
            console.error('Error fetching device states:', error);
            setDeviceStates([]);
          } finally {
            setIsLoadingDeviceStates(false);
          }
        }
      } else {
        setDeviceStates([]);
      }
    };

    fetchDeviceStatesForDevice();
  }, [condition.UUID, condition.sourceType, devices, organizationId]);

  const handleSourceTypeChange = (newSourceType: 'sensor' | 'device') => {
    const newUUID = newSourceType === 'sensor' ? sensors[0]?.uuid : devices[0]?.uuid;
    onChange({
      ...condition,
      sourceType: newSourceType,
      UUID: newUUID || '',
      key: ''
    });
  };

  const handleUUIDChange = (newUUID: string) => {
    onChange({
      ...condition,
      UUID: newUUID,
      key: ''
    });
  };

  const getAvailableKeys = () => {
    if (condition.sourceType === 'sensor') {
      if (isLoadingSensorDetails || !sensorDetails[condition.UUID]) {
        return [];
      }
      return sensorDetails[condition.UUID].TelemetryData?.map(td => ({
        value: td.variableName,
        label: td.variableName
      })) || [];
    } else {
      // For devices, use the fetched device states
      if (isLoadingDeviceStates) {
        return [];
      }
      
      // Extract stateName from device states response
      return deviceStates.map(state => ({
        value: state.stateName,
        label: state.stateName
      }));
    }
  };

  const availableKeys = getAvailableKeys();
  const currentKey = condition.key;

  // Reset key if it's not in available options
  useEffect(() => {
    if (currentKey && availableKeys.length > 0 && !availableKeys.some(k => k.value === currentKey)) {
      onChange({
        ...condition,
        key: ''
      });
    }
  }, [availableKeys, currentKey]);

  const sourceOptions = (condition.sourceType === 'sensor' ? sensors : devices) || [];

  return (
    <div className="flex flex-wrap gap-4 items-center w-full">
      <FormField label="Source Type" id={`source-type-${condition.UUID}`}>
        <select
          className={selectClasses}
          value={condition.sourceType}
          onChange={(e) => handleSourceTypeChange(e.target.value as 'sensor' | 'device')}
        >
          <option value="sensor">Sensor</option>
          <option value="device">Device</option>
        </select>
      </FormField>

      <FormField label={condition.sourceType === 'sensor' ? 'Sensor' : 'Device'} id={`uuid-${condition.UUID}`}>
        <select
          className={selectClasses}
          value={condition.UUID}
          onChange={(e) => handleUUIDChange(e.target.value)}
        >
          {sourceOptions.map((item) => (
            <option key={item.uuid} value={item.uuid}>
              {item.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Key" id={`key-${condition.UUID}`}>
        <select
          className={selectClasses}
          value={condition.key}
          onChange={(e) => onChange({ ...condition, key: e.target.value })}
          disabled={isLoadingSensorDetails || isLoadingDeviceStates || availableKeys.length === 0}
        >
          {availableKeys.length === 0 ? (
            <option value="">
              {isLoadingSensorDetails || isLoadingDeviceStates ? 'Loading...' : 'No options available'}
            </option>
          ) : (
            availableKeys.map((key) => (
              <option key={key.value} value={key.value}>
                {key.label}
              </option>
            ))
          )}
        </select>
      </FormField>

      <FormField label="Operator" id={`operator-${condition.UUID}`}>
        <select
          className={selectClasses}
          value={condition.operator}
          onChange={(e) => onChange({ ...condition, operator: e.target.value })}
        >
          <optgroup label="Basic Comparisons">
            {OPERATORS.filter(op => op.category === 'comparison').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="Null/Empty Checks">
            {OPERATORS.filter(op => op.category === 'null').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="Type Checks">
            {OPERATORS.filter(op => op.category === 'type').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="Numeric Operations">
            {OPERATORS.filter(op => op.category === 'numeric').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="String Operations">
            {OPERATORS.filter(op => op.category === 'string').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="Array Operations">
            {OPERATORS.filter(op => op.category === 'array').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="Time Operations">
            {OPERATORS.filter(op => op.category === 'time').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
          <optgroup label="Time Operations with value to compare with">
            {OPERATORS.filter(op => op.category === 'timeValue').map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </optgroup>
        </select>
      </FormField>

      <ValueInput
        operator={condition.operator}
        value={condition.value}
        duration={condition.duration}
        onChange={(newValue) => onChange({ ...condition, value: newValue })}
        onDurationChange={(newDuration) => onChange({ ...condition, duration: newDuration })}
      />

      {onDelete && (
        <Button type="button" variant="danger" size="sm" onClick={onDelete} className="ml-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      )}
    </div>
  );
};

const ExpressionGroup: React.FC<{
  group: GroupData;
  onChange: (newGroup: GroupData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: { [uuid: string]: Sensor };
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}> = ({ group, onChange, onDelete, sensors, devices, sensorDetails, onFetchSensorDetails }) => {
  const handleTypeChange = (newType: 'AND' | 'OR') => {
    onChange({ ...group, type: newType });
  };

  const handleExpressionChange = (index: number, newExpression: ConditionData | GroupData) => {
    const newExpressions = [...group.expressions];
    newExpressions[index] = newExpression;
    onChange({ ...group, expressions: newExpressions });
  };

  const handleDeleteExpression = (index: number) => {
    const newExpressions = group.expressions.filter((_, i) => i !== index);
    onChange({ ...group, expressions: newExpressions });
  };

  const addCondition = () => {
    onChange({
      ...group,
      expressions: [...group.expressions, {
        sourceType: 'sensor',
        UUID: sensors[0]?.uuid || '',
        key: '',
        operator: '==',
        value: '',
        duration: undefined
      }]
    });
  };

  const addGroup = () => {
    onChange({
      ...group,
      expressions: [...group.expressions, {
        type: 'AND',
        expressions: []
      }]
    });
  };

  return (
    <div className="rounded border border-border dark:border-border-dark p-4 mb-4 bg-card dark:bg-card-dark">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <FormField label="Group Type" id={`group-type-${group.type}-${group.expressions.length}`}>
            <select
              className={selectClasses}
              value={group.type}
              onChange={(e) => handleTypeChange(e.target.value as 'AND' | 'OR')}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </FormField>
          {onDelete && (
            <Button type="button" variant="danger" size="sm" onClick={onDelete} className="ml-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          )}
        </div>

        {group.expressions.map((expr, index) => (
          <div key={index}>
            {index > 0 && (
              <p className="my-2 text-center text-sm text-textSecondary dark:text-textSecondary-dark">
                {group.type}
              </p>
            )}
            {'sourceType' in expr ? (
              <ConditionBuilder
                condition={expr}
                onChange={(newCondition) => handleExpressionChange(index, newCondition)}
                onDelete={() => handleDeleteExpression(index)}
                sensors={sensors}
                devices={devices}
                sensorDetails={sensorDetails}
                onFetchSensorDetails={onFetchSensorDetails}
              />
            ) : (
              <ExpressionGroup
                group={expr}
                onChange={(newGroup) => handleExpressionChange(index, newGroup)}
                onDelete={() => handleDeleteExpression(index)}
                sensors={sensors}
                devices={devices}
                sensorDetails={sensorDetails}
                onFetchSensorDetails={onFetchSensorDetails}
              />
            )}
          </div>
        ))}

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={addCondition}>
            <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Condition
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addGroup}>
            <svg className="w-4 h-4 mr-1 inline-block" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Group
          </Button>
        </div>
      </div>
    </div>
  );
};

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  onClose,
  onSave,
  onUpdate,
  ruleChainId,
  mode = 'add',
  initialExpression,
  sensors,
  devices,
  sensorDetails,
  onFetchSensorDetails,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nodeName, setNodeName] = useState(initialExpression?.name || '');
  const [rootGroup, setRootGroup] = useState<GroupData>(() => ({
    type: 'AND',
    expressions: [{
      sourceType: 'sensor',
      UUID: '',
      key: '',
      operator: '==',
      value: '',
      duration: undefined
    }]
  }));

  // Load initial expression data
  useEffect(() => {
    const loadExpressionData = async () => {
      if (!open || !initialExpression || !sensors.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        let parsedConfig: ParsedExpression | null = null;

        // Try to parse config if it's a string
        if (typeof initialExpression.config === 'string') {
          try {
            parsedConfig = JSON.parse(initialExpression.config);
          } catch (e) {
            console.error('Failed to parse config string:', e);
          }
        }
        // If config is an object, try to use it directly
        else if (initialExpression.config && typeof initialExpression.config === 'object') {
          parsedConfig = initialExpression.config as ParsedExpression;
        }

        // If we have a valid config, process it
        if (parsedConfig) {
          // Handle group structure (normal case)
          if (parsedConfig.type && Array.isArray(parsedConfig.expressions)) {
            await handleParsedConfig(parsedConfig);
          } 
          // Handle flattened condition (single condition optimized by optimizeStructure)
          else if (parsedConfig.sourceType && parsedConfig.UUID && parsedConfig.key && parsedConfig.operator && parsedConfig.value !== undefined) {
            const wrappedConfig = {
              type: 'AND' as const,
              expressions: [parsedConfig]
            };
            await handleParsedConfig(wrappedConfig);
          }
        }
      } catch (error) {
        console.error('Error loading expression data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpressionData();
  }, [open, initialExpression, sensors]);

  // Load sensor details when UUID changes
  useEffect(() => {
    const loadSensorDetails = async () => {
      if (!rootGroup?.expressions?.length) return;

      // Get unique sensor UUIDs that need details loaded
      const sensorUUIDs = new Set<string>();
      
      const collectSensorUUIDs = (expressions: Array<ConditionData | GroupData>) => {
        expressions.forEach(expr => {
          if ('sourceType' in expr && expr.sourceType === 'sensor' && expr.UUID && !sensorDetails[expr.UUID]) {
            sensorUUIDs.add(expr.UUID);
          } else if ('expressions' in expr) {
            collectSensorUUIDs(expr.expressions);
          }
        });
      };
      
      collectSensorUUIDs(rootGroup.expressions);

      // Load details for each unique sensor
      for (const UUID of sensorUUIDs) {
        const sensor = sensors.find(s => s.uuid === UUID);
        if (sensor) {
          await onFetchSensorDetails(sensor.id);
        }
      }
    };

    loadSensorDetails();
  }, [rootGroup, sensors, sensorDetails, onFetchSensorDetails]);

  const handleParsedConfig = async (config: ParsedExpression) => {
    if (!Array.isArray(config.expressions)) {
      console.error('No valid expressions array found');
      return;
    }

    // Recursively convert parsed expressions to proper format
    const convertExpression = (expr: ParsedExpression): ConditionData | GroupData | null => {
      // Check if it's a condition (has sourceType, UUID, key, operator, value)
      if (expr.sourceType && expr.UUID && expr.key && expr.operator && expr.value !== undefined) {
        return {
          sourceType: expr.sourceType as 'sensor' | 'device',
          UUID: expr.UUID,
          key: expr.key,
          operator: expr.operator,
          value: expr.value,
          duration: expr.duration
        };
      }
      // Check if it's a group (has type and expressions)
      else if (expr.type && Array.isArray(expr.expressions)) {
        const nestedExpressions = expr.expressions
          .map(convertExpression)
          .filter((e): e is (ConditionData | GroupData) => e !== null);
        
        if (nestedExpressions.length > 0) {
          return {
            type: expr.type as 'AND' | 'OR',
            expressions: nestedExpressions
          };
        }
      }
      
      return null;
    };

    // Convert all expressions
    const convertedExpressions = config.expressions
      .map(convertExpression)
      .filter((expr): expr is (ConditionData | GroupData) => expr !== null);

    // Set the root group with properly converted expressions
    const newRootGroup: GroupData = {
      type: config.type as 'AND' | 'OR',
      expressions: convertedExpressions
    };

    setRootGroup(newRootGroup);
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setNodeName(initialExpression?.name || '');
    }
  }, [open, initialExpression]);

  const handleSave = () => {
    if (!nodeName.trim()) return;

    // Optimize the structure before saving
    const optimizedConfig = optimizeStructure(rootGroup);

    if (mode === 'edit' && initialExpression?.id && onUpdate) {
      onUpdate(initialExpression.id, {
        name: nodeName.trim(),
        config: JSON.stringify(optimizedConfig),
        type: "filter"  // Preserve the node type
      });
    } else if (onSave) {
      onSave({
        ruleChainId,
        type: "filter",
        name: nodeName.trim(),
        config: JSON.stringify(optimizedConfig),
        nextNodeId: null,
      });
    }
    onClose();
  };

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
        disabled={!nodeName.trim()}
      >
        {mode === 'edit' ? 'Update' : 'Save'}
      </Button>
    </>
  );

  if (isLoading) {
    return (
      <Modal
        isOpen={open}
        onClose={onClose}
        title={mode === 'edit' ? 'Edit Node' : 'Create Node'}
        footer={null}
      >
        <div className="flex justify-center items-center min-h-[200px] text-textMuted dark:text-textMuted-dark">
          Loading...
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Node' : 'Create Node'}
      footer={footer}
    >
      <div className="flex flex-col gap-4 py-2 max-h-[70vh] overflow-y-auto">
        <FormField label="Node Name" id="node-dialog-name" required>
          <input
            id="node-dialog-name"
            type="text"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className={inputClasses}
          />
          {!nodeName.trim() && (
            <p className="mt-1 text-sm text-danger dark:text-danger-dark">Node name is required</p>
          )}
        </FormField>

        <ExpressionGroup
          group={rootGroup}
          onChange={setRootGroup}
          sensors={sensors}
          devices={devices}
          sensorDetails={sensorDetails}
          onFetchSensorDetails={onFetchSensorDetails}
        />

        <div className="mt-2 p-4 rounded border border-border dark:border-border-dark bg-surfaceHover dark:bg-surfaceHover-dark">
          <p className="text-sm font-medium text-textSecondary dark:text-textSecondary-dark mb-2 m-0">
            Preview:
          </p>
          <pre className="m-0 overflow-auto text-sm text-textPrimary dark:text-textPrimary-dark">
            {JSON.stringify(optimizeStructure(rootGroup), null, 2)}
          </pre>
        </div>
      </div>
    </Modal>
  );
};

export default NodeDialog;
