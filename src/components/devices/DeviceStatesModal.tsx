import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { DEVICE_STATE_UI_TYPES } from '../../constants/device';
import FormField from '../common/FormField';
import FormActions from '../common/FormActions';
import Button from '../common/Button/Button';

export interface DeviceStatePayload {
  stateName: string;
  dataType: string;
  defaultValue: string;
  allowedValues: string[];
}

interface DeviceStatesModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
  onNext: (payload: DeviceStatePayload) => void;
  onFinish: (payload: DeviceStatePayload) => void;
  onCancel: () => void;
}

const DeviceStatesModal: React.FC<DeviceStatesModalProps> = ({
  isOpen,
  isSubmitting,
  error,
  onNext,
  onFinish,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const [stateName, setStateName] = React.useState('');
  const [uiType, setUiType] = React.useState<'boolean' | 'enum' | 'range'>('boolean');
  const [defaultValueBoolean, setDefaultValueBoolean] = React.useState<'true' | 'false'>('false');
  const [enumValues, setEnumValues] = React.useState<string[]>(['']);
  const [enumDefault, setEnumDefault] = React.useState('');
  const [rangeMin, setRangeMin] = React.useState<string>('0');
  const [rangeMax, setRangeMax] = React.useState<string>('100');
  const [rangeDefault, setRangeDefault] = React.useState<string>('0');

  React.useEffect(() => {
    if (!isOpen) {
      setStateName('');
      setUiType('boolean');
      setDefaultValueBoolean('false');
      setEnumValues(['']);
      setEnumDefault('');
      setRangeMin('0');
      setRangeMax('100');
      setRangeDefault('0');
    }
  }, [isOpen]);

  const buildPayload = (): DeviceStatePayload | null => {
    if (!stateName.trim()) return null;
    const name = stateName.trim();
    if (uiType === 'boolean') {
      return {
        stateName: name,
        dataType: 'boolean',
        defaultValue: defaultValueBoolean,
        allowedValues: ['true', 'false'],
      };
    }
    if (uiType === 'enum') {
      const values = enumValues.filter((v) => v.trim() !== '');
      if (values.length === 0) return null;
      const def = enumDefault && values.includes(enumDefault) ? enumDefault : values[0];
      return {
        stateName: name,
        dataType: 'string',
        defaultValue: def,
        allowedValues: values,
      };
    }
    const min = Number(rangeMin);
    const max = Number(rangeMax);
    if (Number.isNaN(min) || Number.isNaN(max) || min > max) return null;
    const rangeValues: string[] = [];
    for (let i = min; i <= max; i++) {
      rangeValues.push(String(i));
    }
    const defNum = Number(rangeDefault);
    const defaultStr = !Number.isNaN(defNum) && defNum >= min && defNum <= max ? String(defNum) : rangeValues[0];
    return {
      stateName: name,
      dataType: 'number',
      defaultValue: defaultStr,
      allowedValues: rangeValues,
    };
  };

  const handleNext = () => {
    const payload = buildPayload();
    if (payload) {
      onNext(payload);
      setStateName('');
      setDefaultValueBoolean('false');
      setEnumValues(['']);
      setEnumDefault('');
      setRangeMin('0');
      setRangeMax('100');
      setRangeDefault('0');
    }
  };

  const handleFinish = () => {
    const payload = buildPayload();
    if (payload) {
      onFinish(payload);
    }
  };

  const inputStyle = {
    display: 'block' as const,
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    outline: 'none',
  };
  const selectStyle = {
    ...inputStyle,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    paddingRight: '2.5rem',
  };
  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={onCancel}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: darkMode ? colors.cardBackground : 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          width: isMobile ? '90%' : '28rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 1001,
          border: `1px solid ${darkMode ? colors.border : '#e5e7eb'}`,
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: darkMode ? colors.textPrimary : '#111827',
            marginBottom: '1.5rem',
          }}
        >
          {t('devices.deviceState.addState')}
        </h3>

        {error && (
          <div
            style={{
              backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
              color: darkMode ? colors.dangerText : '#b91c1c',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <FormField label={t('devices.deviceState.stateName')} id="stateName" required>
          <input
            type="text"
            id="stateName"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder={t('devices.deviceState.stateName')}
            style={inputStyle}
          />
        </FormField>

        <FormField label={t('devices.deviceState.dataType')} id="uiType" required>
          <select
            id="uiType"
            value={uiType}
            onChange={(e) => setUiType(e.target.value as 'boolean' | 'enum' | 'range')}
            style={selectStyle}
          >
            {DEVICE_STATE_UI_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        {uiType === 'boolean' && (
          <FormField label={t('devices.deviceState.defaultValue')}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                type="button"
                variant="secondary"
                style={{ flex: 1, ...(defaultValueBoolean === 'true' ? { backgroundColor: darkMode ? '#4d7efa' : '#3b82f6', color: 'white' } : {}) }}
                onClick={() => setDefaultValueBoolean('true')}
              >
                {t('sensors.true')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                style={{ flex: 1, ...(defaultValueBoolean === 'false' ? { backgroundColor: darkMode ? '#4d7efa' : '#3b82f6', color: 'white' } : {}) }}
                onClick={() => setDefaultValueBoolean('false')}
              >
                {t('sensors.false')}
              </Button>
            </div>
          </FormField>
        )}

        {uiType === 'enum' && (
          <>
            <FormField label={t('devices.deviceState.allowedValue')}>
              {enumValues.map((value, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const next = [...enumValues];
                      next[index] = e.target.value;
                      setEnumValues(next);
                    }}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder={t('devices.deviceState.allowedValue')}
                  />
                  {enumValues.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => setEnumValues(enumValues.filter((_, i) => i !== index))}
                      style={{ padding: '0.5rem', minWidth: '2rem' }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEnumValues([...enumValues, ''])}
                style={{ marginTop: '0.5rem' }}
              >
                + {t('devices.deviceState.addValues')}
              </Button>
            </FormField>
            <FormField label={t('devices.deviceState.defaultValue')}>
              <select
                value={enumDefault}
                onChange={(e) => setEnumDefault(e.target.value)}
                style={selectStyle}
              >
                <option value="">{t('devices.selectArea')}</option>
                {enumValues.filter((v) => v.trim()).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </FormField>
          </>
        )}

        {uiType === 'range' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <FormField label={t('devices.minValue')}>
                <input
                  type="number"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(e.target.value)}
                  style={inputStyle}
                />
              </FormField>
              <FormField label={t('devices.maxValue')}>
                <input
                  type="number"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(e.target.value)}
                  style={inputStyle}
                />
              </FormField>
            </div>
            <FormField label={t('devices.deviceState.defaultValue')}>
              <input
                type="number"
                value={rangeDefault}
                onChange={(e) => setRangeDefault(e.target.value)}
                style={inputStyle}
              />
            </FormField>
          </>
        )}

        <FormActions>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('devices.deviceState.cancelButton')}
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting || !stateName.trim()}
          >
            {isSubmitting ? t('devices.deviceState.inProgress') : t('common.next')}
          </Button>
          <Button
            type="button"
            onClick={handleFinish}
            disabled={isSubmitting || !stateName.trim()}
          >
            {isSubmitting ? t('devices.deviceState.inProgress') : t('devices.deviceState.finishButton')}
          </Button>
        </FormActions>
      </div>
    </>
  );
};

export default DeviceStatesModal;
