import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SensorForm, { type TelemetryRowFormState } from '../../components/sensors/SensorForm';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import { createSensor, createTelemetry, selectSensorsLoading, selectSensorsError } from '../../state/slices/sensors.slice';
import { toastService } from '../../services/toastService';
import type { ApiRejectPayload } from '../../types/api';
import { ALLOWED_SENSOR_STATUSES } from '../../types/sensor';
import type { SensorStatus } from '../../constants/sensor';
import type { SensorCreateRequest, SensorUpdateRequest, TelemetryDatatype } from '../../types/sensor';

const SensorCreate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const areaId = searchParams.get('areaId');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);
  const isLoading = useAppSelector(selectSensorsLoading);
  const error = useAppSelector(selectSensorsError);
  const areas = useAppSelector(selectAreas) || [];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAreas());
  }, [dispatch]);

  const validateAndBuildTelemetryRows = (rows?: TelemetryRowFormState[]): { valid: boolean; payload: Array<{ variableName: string; datatype: TelemetryDatatype }> } => {
    if (!rows?.length) return { valid: true, payload: [] };
    const invalidRow = rows.some((row) => {
      const hasVar = row.variableName.trim().length > 0;
      const hasType = row.datatype !== '';
      return hasVar !== hasType;
    });
    if (invalidRow) return { valid: false, payload: [] };
    const payload = rows
      .filter((row) => row.variableName.trim() && row.datatype)
      .map((row) => ({ variableName: row.variableName.trim(), datatype: row.datatype as TelemetryDatatype }));
    return { valid: true, payload };
  };

  const handleSubmit = async (data: SensorCreateRequest | SensorUpdateRequest, telemetryRows?: TelemetryRowFormState[]) => {
    setTelemetryError(null);
    const { valid, payload: validRows } = validateAndBuildTelemetryRows(telemetryRows);
    if (!valid) {
      setTelemetryError(t('sensors.telemetryBothRequired'));
      return;
    }

    const statusValue = data.status as string | undefined;
    const status =
      typeof statusValue === 'string' && ALLOWED_SENSOR_STATUSES.includes(statusValue as SensorStatus)
        ? statusValue
        : 'pending';

    const formData: SensorCreateRequest = {
      name: data.name || '',
      areaId: data.areaId || (areaId ? parseInt(areaId, 10) : 0),
      status,
      description: data.description,
      uuid: (data as SensorCreateRequest).uuid?.trim() || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ''),
    };

    if (!formData.name || !formData.areaId) return;

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(createSensor(formData));
      if (createSensor.fulfilled.match(resultAction)) {
        const sensor = resultAction.payload;
        if (validRows.length && sensor?.id) {
          for (const item of validRows) {
            const telemetryResult = await dispatch(
              createTelemetry({ sensorId: sensor.id, variableName: item.variableName, datatype: item.datatype })
            );
            if (createTelemetry.rejected.match(telemetryResult)) {
              const payload = (telemetryResult.payload as ApiRejectPayload | undefined);
              toastService.error(payload?.message ?? 'Failed to create telemetry');
            }
          }
        }
        navigate(areaId ? `/areas/${areaId}` : '/sensors');
      }
    } catch (err) {
      console.error('Error creating sensor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(areaId ? `/areas/${areaId}` : '/sensors');
  };

  if (isLoading && !Array.isArray(areas)) {
    return <LoadingScreen />;
  }

  return (
    <SensorForm
      areas={areas}
      error={error}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      telemetryError={telemetryError}
      windowWidth={windowWidth}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};

export default SensorCreate; 