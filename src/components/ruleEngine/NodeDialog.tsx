import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Device } from "../../types/device";
import type { Sensor } from "../../types/sensor";

interface ConditionData {
  sourceType: 'sensor' | 'device';
  UUID: string;
  key: string;
  operator: string;
  value: string | number;
}

interface GroupData {
  type: 'AND' | 'OR';
  expressions: Array<ConditionData | GroupData>;
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
  };
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: Sensor | null;
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}

const OPERATORS = ["==", "!=", ">", "<", ">=", "<="];

const ConditionBuilder: React.FC<{
  condition: ConditionData;
  onChange: (newCondition: ConditionData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: Sensor | null;
  onFetchSensorDetails: (sensorId: number) => Promise<void>;
}> = ({ condition, onChange, onDelete, sensors, devices, sensorDetails, onFetchSensorDetails }) => {
  const { t } = useTranslation();

  const handleSourceTypeChange = (newSourceType: 'sensor' | 'device') => {
    const newUUID = newSourceType === 'sensor' ? sensors[0]?.uuid : devices[0]?.uuid;
    onChange({
      ...condition,
      sourceType: newSourceType,
      UUID: newUUID || '',
      key: ''
    });
  };

  const handleUUIDChange = async (newUUID: string) => {
    if (condition.sourceType === 'sensor') {
      const sensor = sensors.find(s => s.uuid === newUUID);
      if (sensor) {
        await onFetchSensorDetails(sensor.id);
      }
    }
    onChange({
      ...condition,
      UUID: newUUID,
      key: ''
    });
  };

  const getAvailableKeys = () => {
    if (condition.sourceType === 'sensor') {
      return sensorDetails?.TelemetryData?.map(td => ({
        value: td.variableName,
        label: td.variableName
      })) || [];
    } else {
      const device = devices.find(d => d.uuid === condition.UUID);
      if (!device?.capabilities) return [];
      
      return Object.entries(device.capabilities).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        return {
          value: formattedKey,
          label: formattedKey
        };
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Source Type</InputLabel>
        <Select
          value={condition.sourceType}
          onChange={(e) => handleSourceTypeChange(e.target.value as 'sensor' | 'device')}
          label="Source Type"
        >
          <MenuItem value="sensor">Sensor</MenuItem>
          <MenuItem value="device">Device</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>{condition.sourceType === 'sensor' ? 'Sensor' : 'Device'}</InputLabel>
        <Select
          value={condition.UUID}
          onChange={(e) => handleUUIDChange(e.target.value)}
          label={condition.sourceType === 'sensor' ? 'Sensor' : 'Device'}
        >
          {(condition.sourceType === 'sensor' ? sensors : devices).map((item) => (
            <MenuItem key={item.uuid} value={item.uuid}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Key</InputLabel>
        <Select
          value={condition.key}
          onChange={(e) => onChange({ ...condition, key: e.target.value })}
          label="Key"
        >
          {getAvailableKeys().map((key) => (
            <MenuItem key={key.value} value={key.value}>
              {key.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Operator</InputLabel>
        <Select
          value={condition.operator}
          onChange={(e) => onChange({ ...condition, operator: e.target.value })}
          label="Operator"
        >
          {OPERATORS.map((op) => (
            <MenuItem key={op} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Value"
        value={condition.value}
        onChange={(e) => onChange({ ...condition, value: e.target.value })}
        sx={{ minWidth: 120 }}
      />

      {onDelete && (
        <IconButton onClick={onDelete} color="error" sx={{ ml: 'auto' }}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

const ExpressionGroup: React.FC<{
  group: GroupData;
  onChange: (newGroup: GroupData) => void;
  onDelete?: () => void;
  sensors: Sensor[];
  devices: Device[];
  sensorDetails: Sensor | null;
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
        value: ''
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
    <Box sx={{ 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      p: 2,
      mb: 2,
      bgcolor: 'background.paper'
    }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Group Type</InputLabel>
            <Select
              value={group.type}
              onChange={(e) => handleTypeChange(e.target.value as 'AND' | 'OR')}
              label="Group Type"
            >
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </Select>
          </FormControl>
          
          {onDelete && (
            <IconButton onClick={onDelete} color="error" sx={{ ml: 'auto' }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        {group.expressions.map((expr, index) => (
          <Box key={index}>
            {index > 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ my: 1, textAlign: 'center' }}>
                {group.type}
              </Typography>
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
          </Box>
        ))}

        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCondition}
            variant="outlined"
            size="small"
          >
            Add Condition
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={addGroup}
            variant="outlined"
            size="small"
          >
            Add Group
          </Button>
        </Stack>
      </Stack>
    </Box>
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
  const { t } = useTranslation();
  const [nodeName, setNodeName] = useState(initialExpression?.name || '');
  const [rootGroup, setRootGroup] = useState<GroupData>({
    type: 'AND',
    expressions: [{
      sourceType: (initialExpression?.sourceType as 'sensor' | 'device') || 'sensor',
      UUID: initialExpression?.UUID || sensors[0]?.uuid || '',
      key: initialExpression?.key || '',
      operator: initialExpression?.operator || '==',
      value: initialExpression?.value || '',
    }]
  });

  useEffect(() => {
    if (open) {
      setNodeName(initialExpression?.name || '');
      setRootGroup({
        type: 'AND',
        expressions: [{
          sourceType: (initialExpression?.sourceType as 'sensor' | 'device') || 'sensor',
          UUID: initialExpression?.UUID || sensors[0]?.uuid || '',
          key: initialExpression?.key || '',
          operator: initialExpression?.operator || '==',
          value: initialExpression?.value || '',
        }]
      });
    }
  }, [open, initialExpression, sensors]);

  const handleSave = () => {
    if (!nodeName.trim()) return;

    if (mode === 'edit' && initialExpression?.id && onUpdate) {
      onUpdate(initialExpression.id, {
        name: nodeName.trim(),
        config: JSON.stringify(rootGroup)
      });
    } else if (onSave) {
      onSave({
        ruleChainId,
        type: "filter",
        name: nodeName.trim(),
        config: JSON.stringify(rootGroup),
        nextNodeId: null,
      });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {mode === 'edit' ? 'Edit Node' : 'Create Node'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
          <TextField
            fullWidth
            label="Node Name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
            error={!nodeName.trim()}
            helperText={!nodeName.trim() ? "Node name is required" : ""}
          />

          <ExpressionGroup
            group={rootGroup}
            onChange={setRootGroup}
            sensors={sensors}
            devices={devices}
            sensorDetails={sensorDetails}
            onFetchSensorDetails={onFetchSensorDetails}
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview:
            </Typography>
            <pre style={{ margin: 0, overflow: 'auto' }}>
              {JSON.stringify(rootGroup, null, 2)}
            </pre>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!nodeName.trim()}
        >
          {mode === 'edit' ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NodeDialog;
