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
import { ALLOWED_STATUSES } from '../../constants/device';

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
    description: '',
    status: 'pending',
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
    controlModes: '',
    organizationId: 0
  });
  
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
        description: device.description,
        status: device.status,
        deviceType: device.deviceType,
        controlType: device.controlType,
        minValue: device.minValue,
        maxValue: device.maxValue,
        defaultState: device.defaultState,
        communicationProtocol: device.communicationProtocol,
        isCritical: device.isCritical,
        metadata: device.metadata || {},
        capabilities: device.capabilities || {},
        areaId: device.areaId,
        controlModes: device.controlModes || '',
        organizationId: device.organizationId
      });
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
    
    if (!formData.name?.trim()) {
      errors.name = t('name_required');
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
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      error={error}
      deviceName={device?.name}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onMetadataChange={handleMetadataChange}
      onCapabilitiesChange={handleCapabilitiesChange}
      onControlModesChange={handleControlModesChange}
      organizations={organizations}
      areas={areas}
    />
  );
};

export default DeviceEdit; 