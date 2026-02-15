import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createDevice, updateDevice, selectDevicesLoading, selectDevicesError } from '../../state/slices/devices.slice';
import { createDeviceState, selectDeviceStatesLoading, selectDeviceStatesError } from '../../state/slices/deviceStates.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import type { DeviceCreateRequest, DeviceCapabilities } from '../../types/device';
import type { ApiRejectPayload } from '../../types/api';
import type { FormErrors } from '../../types/ui';
import DeviceCreate from '../../components/devices/DeviceCreate';
import type { DeviceStatePayload } from '../../components/devices/DeviceStatesModal';

const DeviceCreateContainer = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationIdParam = searchParams.get('organizationId');

  const devicesLoading = useAppSelector(selectDevicesLoading);
  const devicesError = useAppSelector(selectDevicesError);
  const statesLoading = useAppSelector(selectDeviceStatesLoading);
  const statesError = useAppSelector(selectDeviceStatesError);
  const organizations = useAppSelector(selectOrganizations);
  const areas = useAppSelector(selectAreas);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [createdDeviceId, setCreatedDeviceId] = useState<number | null>(null);
  const [addedStates, setAddedStates] = useState<DeviceStatePayload[]>([]);
  const [capabilitiesSaving, setCapabilitiesSaving] = useState(false);
  const [capabilitiesError, setCapabilitiesError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DeviceCreateRequest>({
    name: '',
    description: '',
    status: 'pending',
    organizationId: organizationIdParam ? parseInt(organizationIdParam, 10) : 0,
    deviceType: 'actuator',
    communicationProtocol: undefined,
    isCritical: false,
    areaId: undefined,
    controlModes: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    dispatch(fetchOrganizations());
    dispatch(fetchAreas());
  }, [dispatch]);

  useEffect(() => {
    if (organizationIdParam) {
      setFormData((prev) => ({
        ...prev,
        organizationId: parseInt(organizationIdParam, 10),
      }));
    }
  }, [organizationIdParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    if (name === 'organizationId' || name === 'areaId') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : undefined,
        ...(name === 'organizationId' ? { areaId: undefined } : {}),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleControlModesChange = (modes: string[]) => {
    setFormData((prev) => ({
      ...prev,
      controlModes: modes.join(','),
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) {
      errors.name = t('common.name_required');
    }
    if (!formData.organizationId) {
      errors.organizationId = t('common.organization_required');
    }
    if (!formData.deviceType) {
      errors.deviceType = t('common.deviceType_required');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const resultAction = await dispatch(createDevice(formData));
    if (createDevice.fulfilled.match(resultAction)) {
      const device = resultAction.payload as { id: number };
      if (device?.id) {
        setCreatedDeviceId(device.id);
        setCurrentStep(2);
      }
    }
  };

  const handleStatesNext = async (payload: DeviceStatePayload) => {
    if (!createdDeviceId || !formData.organizationId) return;
    const resultAction = await dispatch(
      createDeviceState({
        deviceId: createdDeviceId,
        state: {
          stateName: payload.stateName,
          dataType: payload.dataType,
          defaultValue: payload.defaultValue,
          allowedValues: payload.allowedValues,
        },
      })
    );
    if (createDeviceState.fulfilled.match(resultAction)) {
      setAddedStates((prev) => [...prev, payload]);
    }
  };

  const handleStatesFinish = async (payload: DeviceStatePayload) => {
    if (!createdDeviceId || !formData.organizationId) return;
    const resultAction = await dispatch(
      createDeviceState({
        deviceId: createdDeviceId,
        state: {
          stateName: payload.stateName,
          dataType: payload.dataType,
          defaultValue: payload.defaultValue,
          allowedValues: payload.allowedValues,
        },
      })
    );
    if (createDeviceState.fulfilled.match(resultAction)) {
      setAddedStates((prev) => [...prev, payload]);
      setCurrentStep(3);
    }
  };

  const buildCapabilities = (): DeviceCapabilities => {
    return addedStates.reduce<DeviceCapabilities>((acc, s) => {
      acc[s.stateName] = {
        stateName: s.stateName,
        dataType: s.dataType,
        defaultValue: s.defaultValue,
        allowedValues: s.allowedValues,
      };
      return acc;
    }, {});
  };

  const handleSaveCapabilities = async () => {
    if (!createdDeviceId || !formData.organizationId) return;
    setCapabilitiesSaving(true);
    setCapabilitiesError(null);
    const capabilities = buildCapabilities();
    const resultAction = await dispatch(
      updateDevice({
        id: createdDeviceId,
        deviceData: { organizationId: formData.organizationId, capabilities },
      })
    );
    setCapabilitiesSaving(false);
    if (updateDevice.fulfilled.match(resultAction)) {
      if (organizationIdParam) {
        navigate(`/organizations/${organizationIdParam}`);
      } else {
        navigate('/devices');
      }
    } else if (updateDevice.rejected.match(resultAction)) {
      const payload = resultAction.payload as ApiRejectPayload | undefined;
      setCapabilitiesError(payload?.message ?? 'Failed to save capabilities');
    }
  };

  const handleCancel = () => {
    if (organizationIdParam) {
      navigate(`/organizations/${organizationIdParam}`);
    } else {
      navigate('/devices');
    }
  };

  const handleCapabilitiesClose = () => {
    if (organizationIdParam) {
      navigate(`/organizations/${organizationIdParam}`);
    } else {
      navigate('/devices');
    }
  };

  return (
    <DeviceCreate
      currentStep={currentStep}
      formData={formData}
      formErrors={formErrors}
      isLoading={devicesLoading}
      error={devicesError}
      organizations={organizations}
      areas={areas}
      onChange={handleChange}
      onControlModesChange={handleControlModesChange}
      onSubmit={handleStep1Submit}
      onCancel={handleCancel}
      createdDeviceId={createdDeviceId}
      statesError={statesError}
      statesLoading={statesLoading}
      onStatesNext={handleStatesNext}
      onStatesFinish={handleStatesFinish}
      onStatesCancel={handleCancel}
      capabilities={buildCapabilities()}
      capabilitiesSaving={capabilitiesSaving}
      capabilitiesError={capabilitiesError}
      onSaveCapabilities={handleSaveCapabilities}
      onCapabilitiesClose={handleCapabilitiesClose}
    />
  );
};

export default DeviceCreateContainer;
