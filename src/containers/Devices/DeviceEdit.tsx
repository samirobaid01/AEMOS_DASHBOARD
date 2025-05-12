import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import {
  fetchDeviceById,
  updateDevice,
  selectSelectedDevice,
  selectDevicesLoading,
  selectDevicesError
} from '../../state/slices/devices.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import type { DeviceUpdateRequest } from '../../types/device';
import DeviceEditComponent from '../../components/devices/DeviceEdit';
import { useTranslation } from 'react-i18next';

const DeviceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const device = useSelector(selectSelectedDevice);
  const isLoading = useSelector(selectDevicesLoading);
  const error = useSelector(selectDevicesError);
  const organizations = useSelector(selectOrganizations);
  const areas = useSelector(selectAreas);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<DeviceUpdateRequest>({
    name: '',
    type: '',
    status: true,
    firmware: '',
    description: '',
    configuration: {},
    areaId: 0,
    organizationId: 0
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
      dispatch(fetchAreas());
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
        configuration: device.configuration || {},
        areaId: device.areaId || 0,
        organizationId: device.organizationId || 0
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
    
    // Handle numeric fields like organizationId and areaId
    if (name === 'organizationId' || name === 'areaId') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : 0,
      }));
      
      // Reset areaId when organization changes
      if (name === 'organizationId') {
        setFormData(prev => ({
          ...prev,
          areaId: 0
        }));
      }
      
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
      errors.name = 'Name is required';
    }
    
    if (!formData.type?.trim()) {
      errors.type = 'Type is required';
    }
    
    // Add area validation if we have an organization selected
    if (formData.organizationId && !formData.areaId) {
      errors.areaId = t('devices.area_required');
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

  const handleCancel = () => {
    if (id) {
      navigate(`/devices/${id}`);
    } else {
      navigate('/devices');
    }
  };
  
  return (
    <DeviceEditComponent
      formData={formData}
      formErrors={formErrors}
      configFields={configFields}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      error={error}
      deviceName={device?.name}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onConfigChange={handleConfigChange}
      onAddConfigField={addConfigField}
      onRemoveConfigField={removeConfigField}
      organizations={organizations}
      areas={areas}
    />
  );
};

export default DeviceEdit; 