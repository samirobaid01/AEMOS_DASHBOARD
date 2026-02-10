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
import {
  fetchDeviceStates,
  createDeviceState,
  updateDeviceState,
  deactivateDeviceState,
  selectDeviceStates,
  selectDeviceStatesLoading,
  selectDeviceStatesError
} from '../../state/slices/deviceStates.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import type { DeviceUpdateRequest } from '../../types/device';
import type { DeviceState } from '../../state/slices/deviceStates.slice';
import DeviceEditComponent from '../../components/devices/DeviceEdit';
import DeviceStateManager from '../../components/devices/DeviceStateManager';
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
  const states = useSelector(selectDeviceStates) || [];
  const statesLoading = useSelector(selectDeviceStatesLoading);
  const statesError = useSelector(selectDeviceStatesError);
  const organizationId = useSelector(selectSelectedOrganizationId);
  const { t } = useTranslation();
  
  // Debug logging for initial state
  useEffect(() => {
    console.log('DeviceEdit: Initial mount', {
      id,
      organizationId,
      device: !!device,
      statesCount: states.length,
      statesLoading,
      statesError
    });
  }, []);
  
  const [formData, setFormData] = useState<DeviceUpdateRequest>({
    name: '',
    description: '',
    status: 'pending',
    deviceType: 'actuator',
    communicationProtocol: undefined,
    isCritical: false,
    areaId: undefined,
    controlModes: '',
    organizationId: 0
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id && organizationId) {
      console.log('DeviceEdit: Fetching data', { id, organizationId });
      
      dispatch(fetchDeviceById(parseInt(id, 10)));
      dispatch(fetchOrganizations());
      dispatch(fetchAreas());
      
      console.log('DeviceEdit: Fetching states', {
        deviceId: parseInt(id, 10),
        organizationId
      });
      
      dispatch(fetchDeviceStates({ 
        deviceId: parseInt(id, 10), 
        organizationId 
      }));
    }
  }, [dispatch, id, organizationId]);

  // Debug logging for states changes
  useEffect(() => {
    console.log('DeviceEdit: States updated', {
      statesCount: states.length,
      states,
      statesLoading,
      statesError
    });
  }, [states, statesLoading, statesError]);

  // Debug logging for device changes
  useEffect(() => {
    console.log('DeviceEdit: Device updated', {
      deviceId: device?.id,
      deviceName: device?.name,
      deviceStates: device?.states
    });
  }, [device]);
  
  useEffect(() => {
    if (device) {
      console.log('DeviceEdit: Setting form data', {
        deviceId: device.id,
        organizationId
      });
      
      setFormData({
        name: device.name,
        description: device.description,
        status: device.status,
        deviceType: device.deviceType,
        communicationProtocol: device.communicationProtocol,
        isCritical: device.isCritical,
        capabilities: device.capabilities,
        areaId: device.areaId,
        controlModes: device.controlModes || '',
        organizationId: organizationId || 0
      });
    }
  }, [device, organizationId]);
  
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

  const handleControlModesChange = (modes: string[]) => {
    setFormData(prev => ({
      ...prev,
      controlModes: modes.join(',')
    }));
  };

  const handleAddState = async (state: Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id || !organizationId) return;
    
    console.log('DeviceEdit: Adding state', {
      deviceId: id,
      organizationId,
      state
    });
    
    try {
      const result = await dispatch(createDeviceState({
        deviceId: parseInt(id, 10),
        state
      })).unwrap();
      
      console.log('DeviceEdit: State added successfully', result);
    } catch (error) {
      console.error('DeviceEdit: Error creating device state:', error);
    }
  };

  const handleUpdateState = async (stateId: number, state: Partial<Omit<DeviceState, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!id || !organizationId) return;
    
    console.log('DeviceEdit: Updating state', {
      deviceId: id,
      stateId,
      organizationId,
      state
    });
    
    try {
      const result = await dispatch(updateDeviceState({
        deviceId: parseInt(id, 10),
        stateId,
        state
      })).unwrap();
      
      console.log('DeviceEdit: State updated successfully', result);
    } catch (error) {
      console.error('DeviceEdit: Error updating device state:', error);
    }
  };

  const handleDeactivateState = async (stateId: number) => {
    if (!id || !organizationId) return;
    
    console.log('DeviceEdit: Deactivating state', {
      deviceId: id,
      stateId,
      organizationId
    });
    
    try {
      const result = await dispatch(deactivateDeviceState({
        deviceId: parseInt(id, 10),
        stateId
      })).unwrap();
      
      console.log('DeviceEdit: State deactivated successfully', result);
    } catch (error) {
      console.error('DeviceEdit: Error deactivating device state:', error);
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      errors.name = t('common.name_required');
    }
    if (!formData.deviceType) {
      errors.deviceType = t('common.deviceType_required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id || !organizationId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { controlModes: _omit, ...deviceData } = formData;
      const resultAction = await dispatch(
        updateDevice({
          id: parseInt(id, 10),
          deviceData
        })
      );
      
      if (updateDevice.fulfilled.match(resultAction)) {
        navigate(`/devices/${id}`);
      }
    } catch (error) {
      console.error('DeviceEdit: Error updating device:', error);
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

  if (!organizationId) {
    console.log('DeviceEdit: No organization selected');
    return (
      <div style={{ padding: '1.5rem' }}>
        <div style={{ 
          backgroundColor: '#fef3c7', 
          color: '#92400e',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {t('organizations.select_organization_first')}
        </div>
      </div>
    );
  }

  console.log('DeviceEdit: Rendering', {
    hasDevice: !!device,
    statesCount: states.length,
    isLoading,
    statesLoading,
    error,
    statesError
  });
  
  return (
    <div style={{ padding: '1.5rem' }}>
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
        onControlModesChange={handleControlModesChange}
        organizations={organizations}
        areas={areas}
      />
      
      {device && (
        <DeviceStateManager
          states={states}
          onAddState={handleAddState}
          onUpdateState={handleUpdateState}
          onDeactivateState={handleDeactivateState}
          isLoading={statesLoading}
          error={statesError}
        />
      )}
    </div>
  );
};

export default DeviceEdit; 