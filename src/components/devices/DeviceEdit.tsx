import React from 'react';
import { useTranslation } from 'react-i18next';
import type { DeviceUpdateRequest } from '../../types/device';
import type { Organization } from '../../types/organization';
import type { Area } from '../../types/area';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
import LoadingScreen from '../common/Loading/LoadingScreen';
import { useTheme } from '../../context/ThemeContext';
import { useThemeColors } from '../../hooks/useThemeColors';

interface DeviceEditProps {
  formData: DeviceUpdateRequest;
  formErrors: Record<string, string>;
  configFields: { key: string; value: string }[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  deviceName: string | undefined;
  organizations: Organization[];
  areas: Area[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onConfigChange: (index: number, field: 'key' | 'value', value: string) => void;
  onAddConfigField: () => void;
  onRemoveConfigField: (index: number) => void;
}

const DeviceEdit: React.FC<DeviceEditProps> = ({
  formData,
  formErrors,
  configFields,
  isLoading,
  isSubmitting,
  error,
  deviceName,
  organizations,
  areas,
  onCancel,
  onSubmit,
  onChange,
  onConfigChange,
  onAddConfigField,
  onRemoveConfigField
}) => {
  const { t } = useTranslation();
  const { darkMode } = useTheme();
  const colors = useThemeColors();

  const selectStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: `1px solid ${darkMode ? colors.border : '#d1d5db'}`,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    backgroundColor: darkMode ? colors.background : 'white',
    color: darkMode ? colors.textPrimary : '#111827',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5rem 1.5rem',
    outline: 'none',
  } as React.CSSProperties;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!deviceName && !isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">{t('device_not_found')}</h3>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              {t('back_to_devices')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('edit_device')} - {deviceName}
          </h1>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={onChange}
                  label={t('name')}
                  error={formErrors.name}
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('organization')}
                </label>
                <select
                  id="organizationId"
                  name="organizationId"
                  // className={`block w-full rounded-md border ${
                  //   formErrors.organizationId ? 'border-red-300' : 'border-gray-300'
                  // } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  style={selectStyle}
                  value={formData.organizationId || ''}
                  onChange={onChange}
                >
                  <option value="">{t('select_organization')}</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {formErrors.organizationId && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.organizationId}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="areaId" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('area')}
                </label>
                <select
                  id="areaId"
                  name="areaId"
                  // className={`block w-full rounded-md border ${
                  //   formErrors.areaId ? 'border-red-300' : 'border-gray-300'
                  // } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  style={selectStyle}
                  value={formData.areaId || ''}
                  onChange={onChange}
                >
                  <option value="">{t('select_area')}</option>
                  {areas
                    .filter(area => !formData.organizationId || area.organizationId === formData.organizationId)
                    .map(area => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                </select>
                {formErrors.areaId && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.areaId}</p>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('type')}
                </label>
                <select
                  id="type"
                  name="type"
                  // className={`block w-full rounded-md border ${
                  //   formErrors.type ? 'border-red-300' : 'border-gray-300'
                  // } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  style={selectStyle}
                  value={formData.type}
                  onChange={onChange}
                  required
                >
                  <option value="">{t('select_type')}</option>
                  <option value="Gateway">Gateway</option>
                  <option value="Controller">Controller</option>
                  <option value="Sensor Node">Sensor Node</option>
                  <option value="Display">Display</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.type && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.type}</p>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <Input
                  id="firmware"
                  name="firmware"
                  type="text"
                  value={formData.firmware || ''}
                  onChange={onChange}
                  label={t('firmware')}
                />
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex flex-col">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={onChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('configuration')}
                  </label>
                  <button
                    type="button"
                    onClick={onAddConfigField}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('add_field')}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {configFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) => onConfigChange(index, 'key', e.target.value)}
                          placeholder={t('config_key')}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => onConfigChange(index, 'value', e.target.value)}
                          placeholder={t('config_value')}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => onRemoveConfigField(index)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="flex items-center mt-4">
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={formData.status}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                    {t('active')}
                  </label>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceEdit; 