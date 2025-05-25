import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { createDevice, selectDevicesLoading, selectDevicesError } from '../../state/slices/devices.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import type { DeviceCreateRequest } from '../../types/device';
import DeviceCreate from '../../components/devices/DeviceCreate';
import { ALLOWED_STATUSES } from '../../constants/device';

const DeviceCreateContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  
  const isLoading = useSelector(selectDevicesLoading);
  const error = useSelector(selectDevicesError);
  const organizations = useSelector(selectOrganizations);
  const areas = useSelector(selectAreas);
  
  const [formData, setFormData] = useState<DeviceCreateRequest>({
    name: '',
    description: '',
    status: 'pending',
    organizationId: organizationId ? parseInt(organizationId, 10) : 0,
    deviceType: 'actuator',
    controlType: 'binary',
    minValue: null,
    maxValue: null,
    defaultState: '',
    communicationProtocol: undefined,
    isCritical: false,
    metadata: {},
    capabilities: {},
    areaId: undefined,
    controlModes: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchAreas());
  }, [dispatch]);
  
  useEffect(() => {
    if (organizationId) {
      setFormData(prev => ({
        ...prev,
        organizationId: parseInt(organizationId, 10)
      }));
    }
  }, [organizationId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    
    if (name === 'organizationId' || name === 'areaId') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : undefined,
      }));
      
      if (name === 'organizationId') {
        setFormData(prev => ({
          ...prev,
          areaId: undefined
        }));
      }
      
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetadataChange = (metadata: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      metadata
    }));
  };

  const handleCapabilitiesChange = (capabilities: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      capabilities
    }));
  };

  const handleControlModesChange = (modes: string[]) => {
    setFormData(prev => ({
      ...prev,
      controlModes: modes.join(',')
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('name_required');
    }
    
    if (!formData.organizationId) {
      errors.organizationId = t('organization_required');
    }
    
    if (!formData.deviceType) {
      errors.deviceType = t('deviceType_required');
    }

    if (!formData.controlType) {
      errors.controlType = t('controlType_required');
    }
    
    if (formData.organizationId && !formData.areaId) {
      errors.areaId = t('devices.area_required');
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
      const resultAction = await dispatch(createDevice(formData));
      if (createDevice.fulfilled.match(resultAction)) {
        return resultAction.payload.data.device;
      }
    } catch (error) {
      console.error('Error creating device:', error);
    }
  };

  const handleCancel = () => {
    if (organizationId) {
      navigate(`/organizations/${organizationId}`);
    } else {
      navigate('/devices');
    }
  };

  const handleComplete = () => {
    if (organizationId) {
      navigate(`/organizations/${organizationId}`);
    } else {
      navigate('/devices');
    }
  };
  
  return (
    <DeviceCreate
      formData={formData}
      formErrors={formErrors}
      isLoading={isLoading}
      error={error}
      organizations={organizations}
      areas={areas}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onMetadataChange={handleMetadataChange}
      onCapabilitiesChange={handleCapabilitiesChange}
      onControlModesChange={handleControlModesChange}
      onCancel={handleCancel}
      onComplete={handleComplete}
    />
  );
};

export default DeviceCreateContainer; 