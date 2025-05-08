import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import {
  fetchDeviceById,
  updateDevice,
  selectSelectedDevice,
  selectDevicesLoading,
  selectDevicesError
} from '../../state/slices/devices.slice';
import { fetchOrganizations } from '../../state/slices/organizations.slice';
import type { DeviceUpdateRequest } from '../../types/device';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';

const DeviceEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const device = useSelector(selectSelectedDevice);
  const isLoading = useSelector(selectDevicesLoading);
  const error = useSelector(selectDevicesError);
  
  const [formData, setFormData] = useState<DeviceUpdateRequest>({
    name: '',
    type: '',
    status: true,
    firmware: '',
    description: '',
    configuration: {}
  });
  
  const [configFields, setConfigFields] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchDeviceById(parseInt(id, 10)));
      dispatch(fetchOrganizations());
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        type: device.type,
        status: device.status,
        firmware: device.firmware || '',
        description: device.description || '',
        configuration: device.configuration || {}
      });
      
      // Convert configuration object to array for form fields
      const configArray = Object.entries(device.configuration || {}).map(
        ([key, value]) => ({ key, value: String(value) })
      );
      
      if (configArray.length === 0) {
        configArray.push({ key: '', value: '' });
      }
      
      setConfigFields(configArray);
    }
  }, [device]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleConfigChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...configFields];
    updatedFields[index][field] = value;
    setConfigFields(updatedFields);
    
    // Update formData.configuration object
    const configuration: Record<string, string> = {};
    updatedFields.forEach(field => {
      if (field.key.trim()) {
        configuration[field.key] = field.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      configuration
    }));
  };
  
  const addConfigField = () => {
    setConfigFields([...configFields, { key: '', value: '' }]);
  };
  
  const removeConfigField = (index: number) => {
    const updatedFields = [...configFields];
    updatedFields.splice(index, 1);
    setConfigFields(updatedFields);
    
    // Update formData.configuration object
    const configuration: Record<string, string> = {};
    updatedFields.forEach(field => {
      if (field.key.trim()) {
        configuration[field.key] = field.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      configuration
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = t('name_required');
    }
    
    if (!formData.type?.trim()) {
      errors.type = t('type_required');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const resultAction = await dispatch(
        updateDevice({
          id: parseInt(id, 10),
          deviceData: formData
        })
      );
      
      if (updateDevice.fulfilled.match(resultAction)) {
        navigate(`/devices/${id}`);
      }
    } catch (error) {
      console.error('Error updating device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading && !device) {
    return <LoadingScreen />;
  }
  
  if (!device && !isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">{t('device_not_found')}</h3>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/devices')}
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
            {t('edit_device')} - {device?.name}
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate(`/devices/${id}`)}
          >
            {t('cancel')}
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  label={t('name')}
                  error={formErrors.name}
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('type')}
                </label>
                <select
                  id="type"
                  name="type"
                  className={`block w-full rounded-md border ${
                    formErrors.type ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  value={formData.type}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                    onChange={handleChange}
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
                    onClick={addConfigField}
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
                          onChange={(e) => handleConfigChange(index, 'key', e.target.value)}
                          placeholder={t('config_key')}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleConfigChange(index, 'value', e.target.value)}
                          placeholder={t('config_value')}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeConfigField(index)}
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
                    onChange={handleChange}
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
                onClick={() => navigate(`/devices/${id}`)}
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