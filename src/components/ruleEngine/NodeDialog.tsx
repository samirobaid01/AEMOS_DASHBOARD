import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useThemeColors } from "../../hooks/useThemeColors";
import Modal from "../common/Modal/Modal";

interface BaseExpression {
  sourceType: "sensor" | "device";
  UUID: string;
  key: string;
  operator: ">" | "<" | "==" | ">=";
  value: string | number;
}

interface CompoundExpression {
  type: "AND" | "OR";
  expressions: (BaseExpression | CompoundExpression)[];
}

type Expression = BaseExpression | CompoundExpression;

interface Device {
  id: number;
  name: string;
  description: string;
  uuid: string;
  status: string;
  deviceType: string;
  communicationProtocol: string;
  isCritical: boolean;
  capabilities: {
    modes?: string[];
    canSwitch?: boolean;
    fanSpeeds?: string[];
    temperatureRange?: number[];
    canSetTemperature?: boolean;
  };
}

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Expression) => void;
  initialData?: Expression;
  token?: string;
}

const NodeDialog: React.FC<NodeDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjcxLCJlbWFpbCI6InNhbWlyYWRtaW5AeW9wbWFpbC5jb20iLCJwZXJtaXNzaW9ucyI6WyJhcmVhLmNyZWF0ZSIsImFyZWEuZGVsZXRlIiwiYXJlYS51cGRhdGUiLCJhcmVhLnZpZXciLCJjb21tYW5kLmNhbmNlbCIsImNvbW1hbmQucmV0cnkiLCJjb21tYW5kLnNlbmQiLCJjb21tYW5kLnZpZXciLCJjb21tYW5kVHlwZS5jcmVhdGUiLCJjb21tYW5kVHlwZS5kZWxldGUiLCJjb21tYW5kVHlwZS51cGRhdGUiLCJjb21tYW5kVHlwZS52aWV3IiwiZGV2aWNlLmFuYWx5dGljcy52aWV3IiwiZGV2aWNlLmNvbnRyb2wiLCJkZXZpY2UuY3JlYXRlIiwiZGV2aWNlLmRlbGV0ZSIsImRldmljZS5oZWFydGJlYXQudmlldyIsImRldmljZS5tZXRhZGF0YS51cGRhdGUiLCJkZXZpY2Uuc3RhdHVzLnVwZGF0ZSIsImRldmljZS51cGRhdGUiLCJkZXZpY2UudmlldyIsIm1haW50ZW5hbmNlLmRlbGV0ZSIsIm1haW50ZW5hbmNlLmxvZyIsIm1haW50ZW5hbmNlLnNjaGVkdWxlIiwibWFpbnRlbmFuY2UudXBkYXRlIiwibWFpbnRlbmFuY2UudmlldyIsIm9yZ2FuaXphdGlvbi5jcmVhdGUiLCJvcmdhbml6YXRpb24uZGVsZXRlIiwib3JnYW5pemF0aW9uLnVwZGF0ZSIsIm9yZ2FuaXphdGlvbi52aWV3IiwicGVybWlzc2lvbi5tYW5hZ2UiLCJyZXBvcnQuZ2VuZXJhdGUiLCJyZXBvcnQudmlldyIsInJvbGUuYXNzaWduIiwicm9sZS52aWV3IiwicnVsZS5jcmVhdGUiLCJydWxlLmRlbGV0ZSIsInJ1bGUudXBkYXRlIiwicnVsZS52aWV3Iiwic2Vuc29yLmNyZWF0ZSIsInNlbnNvci5kZWxldGUiLCJzZW5zb3IudXBkYXRlIiwic2Vuc29yLnZpZXciLCJzZXR0aW5ncy51cGRhdGUiLCJzZXR0aW5ncy52aWV3Iiwic3RhdGUuY3JlYXRlIiwic3RhdGUudmlldyIsInN0YXRlVHJhbnNpdGlvbi5tYW5hZ2UiLCJzdGF0ZVRyYW5zaXRpb24udmlldyIsInN0YXRlVHlwZS5tYW5hZ2UiLCJzdGF0ZVR5cGUudmlldyIsInVzZXIuY3JlYXRlIiwidXNlci5kZWxldGUiLCJ1c2VyLnVwZGF0ZSIsInVzZXIudmlldyJdLCJyb2xlcyI6WyJBZG1pbiJdLCJpYXQiOjE3NDkwNjI5NTUsImV4cCI6MTc0OTE0OTM1NX0.jZDsQkdmQkgI00fW-8eYVSVnG2FLEc5uyrFWcedkogE',
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const [expressionsHistory, setExpressionsHistory] = useState<Expression[][]>([]);
  const [currentType, setCurrentType] = useState<"AND" | "OR" | "SINGLE">("SINGLE");
  const [expressions, setExpressions] = useState<Expression[]>([]);
  const [loading, setLoading] = useState(false);
  const [sensors, setSensors] = useState<Array<{ id: number; uuid: string; name: string }>>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BaseExpression>({
    defaultValues: {
      sourceType: "sensor",
      UUID: "",
      key: "",
      operator: ">",
      value: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      if ('type' in initialData) {
        setCurrentType(initialData.type);
        setExpressions(initialData.expressions);
      } else {
        setCurrentType("SINGLE");
        reset(initialData);
      }
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchSensorsAndDevices = async () => {
      setLoading(true);
      try {
        const [sensorsResponse, devicesResponse] = await Promise.all([
          fetch('http://localhost:3000/api/v1/sensors?organizationId=1', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:3000/api/v1/devices?organizationId=1', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        const sensorsData = await sensorsResponse.json();
        const devicesData = await devicesResponse.json();

        setSensors(sensorsData.data.sensors.map((s: any) => ({
          id: s.id,
          uuid: s.uuid,
          name: s.name,
        })));
        setDevices(devicesData.data.devices);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorsAndDevices();
  }, [token]);

  const fetchKeys = async (sourceType: string, id: string) => {
    try {
      if (sourceType === 'sensor') {
        const response = await fetch(`http://localhost:3000/api/v1/sensors/${id}?organizationId=1`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSelectedKeys(data.data.sensor.TelemetryData.map((t: any) => t.variableName));
      } else {
        // For devices, get the capabilities from the devices list
        const device = devices.find(d => d.id.toString() === id);
        if (device) {
          const deviceKeys = [];
          if (device.capabilities.canSwitch) {
            deviceKeys.push('power');
          }
          if (device.capabilities.modes) {
            deviceKeys.push(...device.capabilities.modes);
          }
          if (device.capabilities.fanSpeeds) {
            deviceKeys.push('fanSpeed');
          }
          if (device.capabilities.canSetTemperature) {
            deviceKeys.push('temperature');
          }
          setSelectedKeys(deviceKeys);
        }
      }
    } catch (error) {
      console.error('Error fetching keys:', error);
    }
  };

  const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('sourceType', e.target.value as "sensor" | "device");
    setValue('UUID', '');
    setValue('key', '');
    setSelectedKeys([]);
  };

  const handleUUIDChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedItem = watch("sourceType") === "sensor" 
      ? sensors.find(s => s.id.toString() === selectedId)
      : devices.find(d => d.id.toString() === selectedId);
    
    if (selectedItem) {
      setValue('UUID', selectedItem.uuid);
      fetchKeys(watch('sourceType'), selectedId);
    }
  };

  const addExpression = (data: BaseExpression) => {
    if (currentType === "SINGLE") {
      onSave(data);
    } else {
      // Save current state to history before updating
      setExpressionsHistory(prev => [...prev, expressions]);
      setExpressions(prev => [...prev, data]);
      reset({
        sourceType: "sensor",
        UUID: "",
        key: "",
        operator: ">",
        value: "",
      });
    }
  };

  const addNestedGroup = (type: "AND" | "OR") => {
    const newGroup: CompoundExpression = {
      type,
      expressions: []
    };
    // Save current state to history before updating
    setExpressionsHistory(prev => [...prev, expressions]);
    setExpressions(prev => [...prev, newGroup]);
  };

  const handleUndo = () => {
    if (expressionsHistory.length > 0) {
      const previousState = expressionsHistory[expressionsHistory.length - 1];
      setExpressions(previousState);
      setExpressionsHistory(prev => prev.slice(0, -1));
    }
  };

  const handleFormSubmit = (data: BaseExpression) => {
    if (currentType === "SINGLE") {
      onSave(data);
    } else {
      if (expressions.length === 0) {
        addExpression(data);
      }
      onSave({
        type: currentType,
        expressions: expressions,
      });
    }
  };

  const isBaseExpression = (expr: Expression): expr is BaseExpression => {
    return !('type' in expr);
  };

  const formGroupStyle = {
    marginBottom: '1rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textPrimary : '#111827',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: darkMode ? colors.surfaceBackground : 'white',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    borderRadius: '0.375rem',
    color: darkMode ? colors.textPrimary : '#111827',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${encodeURIComponent(darkMode ? '#9CA3AF' : '#6B7280')}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  };

  const errorStyle = {
    color: darkMode ? colors.dangerText : '#dc2626',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  };

  const expressionListStyle = {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: darkMode ? colors.background : '#f9fafb',
    borderRadius: '0.5rem',
    border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
    fontFamily: 'monospace',
  };

  const expressionItemStyle = {
    marginLeft: '1.5rem',
    position: 'relative' as const,
  };

  const bracketStyle = {
    color: darkMode ? colors.textSecondary : '#6b7280',
  };

  const propertyStyle = {
    color: darkMode ? '#4d7efa' : '#3b82f6',
    marginRight: '0.5rem',
  };

  const valueStyle = {
    color: darkMode ? colors.textPrimary : '#111827',
  };

  const renderExpression = (expr: Expression, index: number, level: number = 0) => {
    if ('type' in expr) {
      // Compound Expression (AND/OR)
      return (
        <div key={index}>
          <div style={bracketStyle}>{level === 0 ? '{' : ''}</div>
          <div style={expressionItemStyle}>
            <span style={propertyStyle}>"type":</span>
            <span style={valueStyle}>"{expr.type}",</span>
            <br />
            <span style={propertyStyle}>"expressions":</span>
            <span style={bracketStyle}>[</span>
            <div style={expressionItemStyle}>
              {expr.expressions.map((e, i) => (
                <React.Fragment key={i}>
                  {renderExpression(e, i, level + 1)}
                  {i < expr.expressions.length - 1 && <span style={bracketStyle}>,</span>}
                </React.Fragment>
              ))}
            </div>
            <span style={bracketStyle}>]</span>
          </div>
          <div style={bracketStyle}>{level === 0 ? '}' : ''}</div>
        </div>
      );
    } else {
      // Base Expression
      return (
        <div key={index} style={expressionItemStyle}>
          <span style={bracketStyle}>{`{`}</span>
          <div style={expressionItemStyle}>
            <span style={propertyStyle}>"sourceType":</span>
            <span style={valueStyle}>"{expr.sourceType}",</span>
            <br />
            <span style={propertyStyle}>"UUID":</span>
            <span style={valueStyle}>"{expr.UUID}",</span>
            <br />
            <span style={propertyStyle}>"key":</span>
            <span style={valueStyle}>"{expr.key}",</span>
            <br />
            <span style={propertyStyle}>"operator":</span>
            <span style={valueStyle}>"{expr.operator}",</span>
            <br />
            <span style={propertyStyle}>"value":</span>
            <span style={valueStyle}>{typeof expr.value === 'string' ? `"${expr.value}"` : expr.value}</span>
          </div>
          <span style={bracketStyle}>{`}`}</span>
        </div>
      );
    }
  };

  const modalFooter = (
    <>
      <button
        onClick={onClose}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? colors.surfaceBackground : 'white',
          color: darkMode ? colors.textSecondary : '#4b5563',
          border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
      >
        {t('common.cancel')}
      </button>
      <button
        type="submit"
        form="nodeForm"
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#4d7efa' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s',
        }}
      >
        {t('common.save')}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={t("ruleEngine.ruleNode.title")}
      footer={modalFooter}
    >
      <div style={formGroupStyle}>
        <label style={labelStyle}>Expression Type</label>
        <select
          style={selectStyle}
          value={currentType}
          onChange={(e) => setCurrentType(e.target.value as "AND" | "OR" | "SINGLE")}
        >
          <option value="SINGLE">Single Condition</option>
          <option value="AND">AND Group</option>
          <option value="OR">OR Group</option>
        </select>
      </div>

      {currentType !== "SINGLE" && expressions.length > 0 && (
        <div style={expressionListStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}>
            <h4 style={{
              margin: 0,
              color: darkMode ? colors.textPrimary : '#111827',
              fontFamily: 'system-ui',
            }}>
              Current Expression
            </h4>
            <button
              type="button"
              onClick={handleUndo}
              disabled={expressionsHistory.length === 0}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: 'transparent',
                color: expressionsHistory.length === 0 
                  ? (darkMode ? colors.textSecondary : '#9CA3AF')
                  : (darkMode ? colors.dangerText : '#dc2626'),
                border: `1px solid ${expressionsHistory.length === 0 
                  ? (darkMode ? colors.border : '#e5e7eb')
                  : (darkMode ? colors.dangerText : '#dc2626')}`,
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                cursor: expressionsHistory.length === 0 ? 'not-allowed' : 'pointer',
                opacity: expressionsHistory.length === 0 ? 0.5 : 1,
              }}
            >
              Undo Last Step
            </button>
          </div>
          <div style={bracketStyle}>{`{`}</div>
          <div style={expressionItemStyle}>
            <span style={propertyStyle}>"type":</span>
            <span style={valueStyle}>"{currentType}",</span>
            <br />
            <span style={propertyStyle}>"expressions":</span>
            <span style={bracketStyle}>[</span>
            <div style={expressionItemStyle}>
              {expressions.map((expr, index) => (
                <React.Fragment key={index}>
                  {renderExpression(expr, index)}
                  {index < expressions.length - 1 && <span style={bracketStyle}>,</span>}
                </React.Fragment>
              ))}
            </div>
            <span style={bracketStyle}>]</span>
          </div>
          <div style={bracketStyle}>{`}`}</div>
        </div>
      )}

      <form id="nodeForm" onSubmit={handleSubmit(handleFormSubmit)}>
        {currentType !== "SINGLE" && (
          <div style={formGroupStyle}>
            <button
              type="button"
              onClick={() => addNestedGroup("AND")}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: darkMode ? colors.surfaceBackground : 'white',
                color: darkMode ? colors.textSecondary : '#4b5563',
                border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                width: '48%',
                marginRight: '4%',
              }}
            >
              Add AND Group
            </button>
            <button
              type="button"
              onClick={() => addNestedGroup("OR")}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: darkMode ? colors.surfaceBackground : 'white',
                color: darkMode ? colors.textSecondary : '#4b5563',
                border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                width: '48%',
              }}
            >
              Add OR Group
            </button>
          </div>
        )}

        <div style={formGroupStyle}>
          <label style={labelStyle}>Source Type</label>
          <select
            {...register("sourceType")}
            style={selectStyle}
            onChange={handleSourceTypeChange}
          >
            <option value="sensor">Sensor</option>
            <option value="device">Device</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>{watch("sourceType") === "sensor" ? "Sensor" : "Device"}</label>
          <select
            {...register("UUID")}
            style={selectStyle}
            onChange={handleUUIDChange}
          >
            <option value="">Select {watch("sourceType") === "sensor" ? "Sensor" : "Device"}</option>
            {watch("sourceType") === "sensor"
              ? sensors.map((sensor) => (
                  <option key={sensor.uuid} value={sensor.id}>
                    {sensor.name}
                  </option>
                ))
              : devices.map((device) => (
                  <option key={device.uuid} value={device.id}>
                    {device.name}
                  </option>
                ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Key</label>
          <select
            {...register("key")}
            style={selectStyle}
          >
            <option value="">Select Key</option>
            {selectedKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Operator</label>
          <select
            {...register("operator")}
            style={selectStyle}
          >
            <option value=">">Greater than</option>
            <option value="<">Less than</option>
            <option value="==">Equals</option>
            <option value=">=">Greater than or equal</option>
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Value</label>
          <input
            {...register("value")}
            style={inputStyle}
            type={watch("sourceType") === "sensor" ? "number" : "text"}
          />
        </div>

        {currentType !== "SINGLE" && (
          <button
            type="button"
            onClick={handleSubmit(addExpression)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: darkMode ? colors.surfaceBackground : 'white',
              color: darkMode ? colors.textSecondary : '#4b5563',
              border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            Add Condition
          </button>
        )}
      </form>
    </Modal>
  );
};

export default NodeDialog;
