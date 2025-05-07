import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { createSensor, selectSensorsLoading, selectSensorsError } from '../../state/slices/sensors.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import type { SensorCreateRequest } from '../../types/sensor';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const SensorCreate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const areaId = searchParams.get('areaId');
  
  const isLoading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const areas = useSelector(selectAreas);
  
  const [formData, setFormData] = useState<SensorCreateRequest>({
    name: '',
    areaId: areaId ? parseInt(areaId, 10) : 0,
    type: '',
    status: true,
    description: '',
    metadata: {}
  });
  
  const [metadataFields, setMetadataFields] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);
  
  useEffect(() => {
    if (areaId) {
      setFormData(prev => ({
        ...prev,
        areaId: parseInt(areaId, 10)
      }));
    }
  }, [areaId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    
    if (name === 'areaId') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10),
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleMetadataChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...metadataFields];
    updatedFields[index][field] = value;
    setMetadataFields(updatedFields);
    
    // Update formData.metadata object
    const metadata: Record<string, string> = {};
    metadataFields.forEach(field => {
      if (field.key.trim()) {
        metadata[field.key] = field.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      metadata
    }));
  };
  
  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };
  
  const removeMetadataField = (index: number) => {
    const updatedFields = [...metadataFields];
    updatedFields.splice(index, 1);
    setMetadataFields(updatedFields);
    
    // Update formData.metadata object
    const metadata: Record<string, string> = {};
    updatedFields.forEach(field => {
      if (field.key.trim()) {
        metadata[field.key] = field.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      metadata
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('name_required');
    }
    
    if (!formData.areaId) {
      errors.areaId = t('area_required');
    }
    
    if (!formData.type.trim()) {
      errors.type = t('type_required');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const resultAction = await dispatch(createSensor(formData));
      if (createSensor.fulfilled.match(resultAction)) {
        if (areaId) {
          navigate(`/areas/${areaId}`);
        } else {
          navigate('/sensors');
        }
      }
    } catch (error) {
      console.error('Error creating sensor:', error);
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('new_sensor')}</h1>
          <Button
            variant="outline"
            onClick={() => areaId ? navigate(`/areas/${areaId}`) : navigate('/sensors')}
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
                  placeholder={t('enter_sensor_name')}
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
                  <option value="Temperature">Temperature</option>
                  <option value="Humidity">Humidity</option>
                  <option value="Pressure">Pressure</option>
                  <option value="Motion">Motion</option>
                  <option value="Light">Light</option>
                  <option value="Air Quality">Air Quality</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.type && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.type}</p>
                )}
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="areaId" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('area')}
                </label>
                <select
                  id="areaId"
                  name="areaId"
                  className={`block w-full rounded-md border ${
                    formErrors.areaId ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  value={formData.areaId || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('select_area')}</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                {formErrors.areaId && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.areaId}</p>
                )}
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
                    placeholder={t('enter_sensor_description')}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('metadata')}
                  </label>
                  <button
                    type="button"
                    onClick={addMetadataField}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t('add_field')}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {metadataFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) => handleMetadataChange(index, 'key', e.target.value)}
                          placeholder={t('metadata_key')}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleMetadataChange(index, 'value', e.target.value)}
                          placeholder={t('metadata_value')}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMetadataField(index)}
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
                onClick={() => areaId ? navigate(`/areas/${areaId}`) : navigate('/sensors')}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {t('create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SensorCreate; 