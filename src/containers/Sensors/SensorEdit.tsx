import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SensorForm, { type TelemetryRowFormState } from '../../components/sensors/SensorForm';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import {
  createTelemetry,
  fetchSensorById,
  selectSelectedSensor,
  selectSensorsError,
  selectSensorsLoading,
  updateSensor,
  updateTelemetry,
} from '../../state/slices/sensors.slice';
import type { AppDispatch } from '../../state/store';
import { toastService } from '../../services/toastService';
import type { SensorUpdateRequest, TelemetryDatatype } from '../../types/sensor';

const SensorEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sensor = useSelector(selectSelectedSensor);
  const areas = useSelector(selectAreas) || [];
  const isLoading = useSelector(selectSensorsLoading);
  const error = useSelector(selectSensorsError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [telemetryError, setTelemetryError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(fetchSensorById(parseInt(id, 10)));
      dispatch(fetchAreas());
    }
  }, [dispatch, id]);

  const validateAndBuildTelemetryRows = (rows?: TelemetryRowFormState[]): { valid: boolean; payload: Array<{ id?: number; variableName: string; datatype: TelemetryDatatype }> } => {
    if (!rows?.length) return { valid: true, payload: [] };
    const invalidRow = rows.some((row) => {
      const hasVar = row.variableName.trim().length > 0;
      const hasType = row.datatype !== '';
      return hasVar !== hasType;
    });
    if (invalidRow) return { valid: false, payload: [] };
    const payload = rows
      .filter((row) => row.variableName.trim() && row.datatype)
      .map((row) => ({
        ...(row.id != null ? { id: row.id } : {}),
        variableName: row.variableName.trim(),
        datatype: row.datatype as TelemetryDatatype,
      }));
    return { valid: true, payload };
  };

  const handleSubmit = async (data: SensorUpdateRequest, telemetryRows?: TelemetryRowFormState[]) => {
    if (!id || !sensor) return;
    if (!data.name) return;

    setTelemetryError(null);
    const { valid, payload: validRows } = validateAndBuildTelemetryRows(telemetryRows);
    if (!valid) {
      setTelemetryError(t('sensors.telemetryBothRequired'));
      return;
    }

    const sensorData: SensorUpdateRequest = {
      name: data.name,
      description: data.description,
      status: data.status,
      uuid: data.uuid,
      areaId: data.areaId,
    };

    setIsSubmitting(true);
    try {
      const resultAction = await dispatch(
        updateSensor({ id: parseInt(id, 10), sensorData })
      );

      if (updateSensor.fulfilled.match(resultAction) && validRows.length) {
        for (const row of validRows) {
          if (!row.variableName || !row.datatype) continue;
          if (row.id != null) {
            const updateResult = await dispatch(
              updateTelemetry({ id: row.id, data: { variableName: row.variableName, datatype: row.datatype } })
            );
            if (updateTelemetry.rejected.match(updateResult)) {
              toastService.error((updateResult.payload as string) || 'Failed to update telemetry');
            }
          } else {
            const createResult = await dispatch(
              createTelemetry({ sensorId: sensor.id, variableName: row.variableName, datatype: row.datatype as TelemetryDatatype })
            );
            if (createTelemetry.rejected.match(createResult)) {
              toastService.error((createResult.payload as string) || 'Failed to create telemetry');
            }
          }
        }
      }
      if (updateSensor.fulfilled.match(resultAction)) {
        navigate(`/sensors/${id}`);
      }
    } catch (err) {
      console.error('Error updating sensor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(id ? `/sensors/${id}` : '/sensors');
  };

  if (isLoading && !sensor) {
    return <LoadingScreen />;
  }

  if (!sensor && !isLoading) {
    return (
      <div style={{
        padding: '2rem',
        maxWidth: '48rem',
        margin: '0 auto',
        backgroundColor: '#fefce8',
        border: '1px solid #fbbf24',
        borderRadius: '0.5rem',
        textAlign: 'center',
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#854d0e', marginBottom: '1rem' }}>
          Sensor not found
        </h3>
        <button
          onClick={() => navigate('/sensors')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back to sensors
        </button>
      </div>
    );
  }

  return (
    <SensorForm
      areas={areas}
      error={error}
      isLoading={isLoading}
      isEditMode={true}
      isSubmitting={isSubmitting}
      sensor={sensor}
      telemetryError={telemetryError}
      windowWidth={windowWidth}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
    />
  );
};

export default SensorEdit; 