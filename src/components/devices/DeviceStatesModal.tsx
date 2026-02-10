import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { DEVICE_STATE_UI_TYPES } from '../../constants/device';

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

  const fieldGroupStyle = { marginBottom: '1.5rem' };
  const labelStyle = {
    display: 'block' as const,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: darkMode ? colors.textSecondary : '#374151',
    marginBottom: '0.5rem',
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
  const buttonStyle = (variant: 'primary' | 'secondary' | 'success') => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    border: variant === 'secondary' ? `1px solid ${darkMode ? colors.border : '#d1d5db'}` : 'none',
    backgroundColor:
      variant === 'primary'
        ? darkMode
          ? '#4d7efa'
          : '#3b82f6'
        : variant === 'success'
          ? darkMode
            ? colors.successBackground
            : '#dcfce7'
          : darkMode
            ? colors.surfaceBackground
            : 'white',
    color:
      variant === 'primary' || variant === 'success'
        ? variant === 'success'
          ? darkMode
            ? colors.successText
            : '#166534'
          : 'white'
        : darkMode
          ? colors.textSecondary
          : '#4b5563',
  });

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

        <div style={fieldGroupStyle}>
          <label htmlFor="stateName" style={labelStyle}>
            {t('devices.deviceState.stateName')} <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            id="stateName"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            placeholder={t('devices.deviceState.stateName')}
            style={inputStyle}
          />
        </div>

        <div style={fieldGroupStyle}>
          <label htmlFor="uiType" style={labelStyle}>
            {t('devices.deviceState.dataType')} <span style={{ color: '#ef4444' }}>*</span>
          </label>
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
        </div>

        {uiType === 'boolean' && (
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>{t('devices.deviceState.defaultValue')}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDefaultValueBoolean('true')}
                style={{
                  ...buttonStyle('secondary'),
                  flex: 1,
                  backgroundColor: defaultValueBoolean === 'true' ? (darkMode ? '#4d7efa' : '#3b82f6') : undefined,
                  color: defaultValueBoolean === 'true' ? 'white' : undefined,
                }}
              >
                {t('sensors.true')}
              </button>
              <button
                type="button"
                onClick={() => setDefaultValueBoolean('false')}
                style={{
                  ...buttonStyle('secondary'),
                  flex: 1,
                  backgroundColor: defaultValueBoolean === 'false' ? (darkMode ? '#4d7efa' : '#3b82f6') : undefined,
                  color: defaultValueBoolean === 'false' ? 'white' : undefined,
                }}
              >
                {t('sensors.false')}
              </button>
            </div>
          </div>
        )}

        {uiType === 'enum' && (
          <>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>{t('devices.deviceState.allowedValue')}</label>
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
                    <button
                      type="button"
                      onClick={() => setEnumValues(enumValues.filter((_, i) => i !== index))}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: darkMode ? colors.dangerBackground : '#fee2e2',
                        color: darkMode ? colors.dangerText : '#b91c1c',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEnumValues([...enumValues, ''])}
                style={{ ...buttonStyle('secondary'), marginTop: '0.5rem' }}
              >
                + {t('devices.deviceState.addValues')}
              </button>
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>{t('devices.deviceState.defaultValue')}</label>
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
            </div>
          </>
        )}

        {uiType === 'range' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('devices.minValue')}</label>
                <input
                  type="number"
                  value={rangeMin}
                  onChange={(e) => setRangeMin(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('devices.maxValue')}</label>
                <input
                  type="number"
                  value={rangeMax}
                  onChange={(e) => setRangeMax(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>{t('devices.deviceState.defaultValue')}</label>
              <input
                type="number"
                value={rangeDefault}
                onChange={(e) => setRangeDefault(e.target.value)}
                style={inputStyle}
              />
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
          <button type="button" onClick={onCancel} style={buttonStyle('secondary')}>
            {t('devices.deviceState.cancelButton')}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting || !stateName.trim()}
            style={buttonStyle('primary')}
          >
            {isSubmitting ? t('devices.deviceState.inProgress') : t('common.next')}
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={isSubmitting || !stateName.trim()}
            style={buttonStyle('success')}
          >
            {isSubmitting ? t('devices.deviceState.inProgress') : t('devices.deviceState.finishButton')}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeviceStatesModal;
