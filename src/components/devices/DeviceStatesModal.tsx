import React from 'react';
import { useTranslation } from 'react-i18next';
import { DEVICE_STATE_UI_TYPES } from '../../constants/device';
import FormField from '../common/FormField';
import Button from '../common/Button/Button';
import Modal from '../common/Modal/Modal';
import type { DeviceStatesModalProps, DeviceStatePayload } from './types';

export type { DeviceStatePayload };

const inputClasses =
  'block w-full px-3 py-2 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary';
const selectClasses =
  'block w-full px-3 py-2 pr-10 rounded border border-border dark:border-border-dark bg-surface dark:bg-surface-dark text-textPrimary dark:text-textPrimary-dark text-sm outline-none focus:ring-2 focus:ring-primary appearance-none bg-no-repeat bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]';

const DeviceStatesModal: React.FC<DeviceStatesModalProps> = ({
  isOpen,
  isSubmitting,
  error,
  onNext,
  onFinish,
  onCancel,
}) => {
  const { t } = useTranslation();

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

  const footer = (
    <div className="flex flex-wrap justify-end gap-2">
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
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={t('devices.deviceState.addState')}
      footer={footer}
      size="md"
    >
      {error && (
        <div className="mb-4 p-3 rounded text-sm bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark">
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
          className={inputClasses}
        />
      </FormField>

      <FormField label={t('devices.deviceState.dataType')} id="uiType" required>
        <select
          id="uiType"
          value={uiType}
          onChange={(e) => setUiType(e.target.value as 'boolean' | 'enum' | 'range')}
          className={selectClasses}
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
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className={`flex-1 ${defaultValueBoolean === 'true' ? 'bg-primary text-white dark:bg-primary-dark dark:text-white' : ''}`}
              onClick={() => setDefaultValueBoolean('true')}
            >
              {t('sensors.true')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className={`flex-1 ${defaultValueBoolean === 'false' ? 'bg-primary text-white dark:bg-primary-dark dark:text-white' : ''}`}
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
              <div key={`enum-${index}`} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const next = [...enumValues];
                    next[index] = e.target.value;
                    setEnumValues(next);
                  }}
                  className={`${inputClasses} flex-1`}
                  placeholder={t('devices.deviceState.allowedValue')}
                />
                {enumValues.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => setEnumValues(enumValues.filter((_, i) => i !== index))}
                    className="p-2 min-w-[2rem]"
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
              className="mt-2"
            >
              + {t('devices.deviceState.addValues')}
            </Button>
          </FormField>
          <FormField label={t('devices.deviceState.defaultValue')}>
            <select
              value={enumDefault}
              onChange={(e) => setEnumDefault(e.target.value)}
              className={selectClasses}
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
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label={t('devices.minValue')}>
              <input
                type="number"
                value={rangeMin}
                onChange={(e) => setRangeMin(e.target.value)}
                className={inputClasses}
              />
            </FormField>
            <FormField label={t('devices.maxValue')}>
              <input
                type="number"
                value={rangeMax}
                onChange={(e) => setRangeMax(e.target.value)}
                className={inputClasses}
              />
            </FormField>
          </div>
          <FormField label={t('devices.deviceState.defaultValue')}>
            <input
              type="number"
              value={rangeDefault}
              onChange={(e) => setRangeDefault(e.target.value)}
              className={inputClasses}
            />
          </FormField>
        </>
      )}
    </Modal>
  );
};

export default DeviceStatesModal;
