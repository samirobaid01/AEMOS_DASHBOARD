import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import Button from '../Button/Button';

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

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  if (Array.isArray(value)) return value.join(',');
  if (typeof value === 'object') return '';
  return String(value);
};

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
    console.log('Add button clicked');
    const newPair = { key: '', value: valueType === 'boolean' ? false : valueType === 'array' ? [] : '' };
    const existingPairs = pairs || [];
    const newPairs = [...existingPairs, newPair];
    console.log('Adding new pair:', { newPair, existingPairs, newPairs });
    onChange(newPairs);
  };

  const handleRemove = (index: number) => {
    console.log('Removing pair at index:', index, 'Current pairs:', pairs);
    const newPairs = (pairs || []).filter((_, i) => i !== index);
    console.log('After removal:', newPairs);
    onChange(newPairs);
  };

  const handleChange = (index: number, field: 'key' | 'value', value: string | boolean | number | string[]) => {
    console.log('DynamicKeyValueInput state:', {
      currentIndex: index,
      currentPairs: pairs,
      field,
      newValue: value,
      pairsLength: pairs?.length
    });

    const existingPairs = pairs || [];
    const newPairs = existingPairs.map((pair, i) => {
      if (i === index) {
        return {
          ...pair,
          [field]: value
        };
      }
      return pair;
    });

    console.log('Updated pairs:', newPairs);
    onChange(newPairs);
  };

  const renderValueInput = (pair: KeyValuePair, index: number) => {
    const inputClassName = "block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    
    switch (valueType) {
      case 'boolean':
        return (
          <select
            value={String(pair.value)}
            onChange={(e) => handleChange(index, 'value', e.target.value === 'true')}
            className={inputClassName}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={formatValue(pair.value)}
            onChange={(e) => handleChange(index, 'value', parseFloat(e.target.value))}
            placeholder={valuePlaceholder}
            className={inputClassName}
          />
        );
      case 'array':
        return (
          <input
            type="text"
            value={Array.isArray(pair.value) ? pair.value.join(',') : formatValue(pair.value)}
            onChange={(e) => handleChange(index, 'value', e.target.value.split(',').map(item => item.trim()))}
            placeholder={valuePlaceholder}
            className={inputClassName}
          />
        );
      default:
        return (
          <input
            type="text"
            value={formatValue(pair.value)}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
            placeholder={valuePlaceholder}
            className={inputClassName}
          />
        );
    }
  };

  const availablePredefinedKeys = predefinedKeys.filter(
    key => !pairs.some(pair => pair.key === key)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="space-y-3">
        {(pairs || []).map((pair, index) => (
         <div key={index} className="group relative flex flex-row gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg 
         shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 
         transition-all duration-200">
         {/* Key input - select or text */}
         <div className="flex-1 gap-2 min-w-[120px]">
           {predefinedKeys.length > 0 ? (
             <select
               value={pair.key}
               onChange={(e) => handleChange(index, 'key', e.target.value)}
               className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
               rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
             >
               <option value="">{keyPlaceholder}</option>
               {[
                 ...(pair.key && predefinedKeys.includes(pair.key) ? [pair.key] : []),
                 ...availablePredefinedKeys
               ].map((key) => (
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
               className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
             />
           )}
         </div>
       
         {/* Value input */}
         <div className="flex-1 min-w-[150px]">
           {renderValueInput(pair, index)}
         </div>
       
         {/* Remove button */}
         <Button
           type="button"
           variant="danger"
           size="sm"
           onClick={() => handleRemove(index)}
           title="Remove field"
           style={{ minWidth: '2rem', padding: '0.25rem' }}
         >
           <MinusCircleIcon className="h-6 w-6" />
         </Button>
       </div>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        onClick={() => handleAdd()}
        style={{ marginTop: '0.5rem' }}
      >
        <PlusIcon className="h-4 w-4 mr-1.5" />
        {t('common.addField')}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
    </div>
  );
};

export default DynamicKeyValueInput; 
