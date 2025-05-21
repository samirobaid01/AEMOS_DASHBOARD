import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, MinusCircleIcon } from '@heroicons/react/24/outline';

interface KeyValuePair {
  key: string;
  value: string | boolean | number | string[] | unknown;
}

interface DynamicKeyValueInputProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  label?: string;
  valueType?: 'text' | 'number' | 'boolean' | 'array';
  predefinedKeys?: readonly string[];
  error?: string;
  className?: string;
}

const DynamicKeyValueInput: React.FC<DynamicKeyValueInputProps> = ({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  label,
  valueType = 'text',
  predefinedKeys = [],
  error,
  className = '',
}) => {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange([...pairs, { key: '', value: valueType === 'boolean' ? false : valueType === 'array' ? [] : '' }]);
  };

  const handleRemove = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    onChange(newPairs);
  };

  const handleChange = (index: number, field: 'key' | 'value', value: string | boolean | number | string[]) => {
    const newPairs = [...pairs];
    newPairs[index] = {
      ...newPairs[index],
      [field]: value,
    };
    onChange(newPairs);
  };

  const renderValueInput = (pair: KeyValuePair, index: number) => {
    switch (valueType) {
      case 'boolean':
        return (
          <select
            value={String(pair.value)}
            onChange={(e) => handleChange(index, 'value', e.target.value === 'true')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={pair.value as number}
            onChange={(e) => handleChange(index, 'value', parseFloat(e.target.value))}
            placeholder={valuePlaceholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
      case 'array':
        return (
          <input
            type="text"
            value={(pair.value as string[]).join(',')}
            onChange={(e) => handleChange(index, 'value', e.target.value.split(',').map(item => item.trim()))}
            placeholder={valuePlaceholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
      default:
        return (
          <input
            type="text"
            value={pair.value as string}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {pairs.map((pair, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              {predefinedKeys.length > 0 ? (
                <select
                  value={pair.key}
                  onChange={(e) => handleChange(index, 'key', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">{keyPlaceholder}</option>
                  {predefinedKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={pair.key}
                  onChange={(e) => handleChange(index, 'key', e.target.value)}
                  placeholder={keyPlaceholder}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              )}
            </div>
            <div className="flex-1">
              {renderValueInput(pair, index)}
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="inline-flex items-center text-red-600 hover:text-red-800"
              >
                <MinusCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        {t('common.addField')}
      </button>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DynamicKeyValueInput; 