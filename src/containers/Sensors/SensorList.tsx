import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import SensorListComponent from '../../components/sensors/SensorList';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import { fetchSensors, fetchSensorsByOrganizationId, selectSensors, selectSensorsError, selectSensorsLoading } from '../../state/slices/sensors.slice';
import type { Sensor } from '../../types/sensor';

const SensorList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sensors = useAppSelector(selectSensors) || [];
  const isLoading = useAppSelector(selectSensorsLoading);
  const selectedOrganizationId = useAppSelector(selectSelectedOrganizationId);
  const error = useAppSelector(selectSensorsError);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (selectedOrganizationId) {
      dispatch(fetchSensorsByOrganizationId(parseInt(selectedOrganizationId.toString(), 10)));
    } else {
      dispatch(fetchSensors());
    }
  }, [dispatch, selectedOrganizationId]);

  const filteredSensors = Array.isArray(sensors)
    ? sensors.filter((sensor: Sensor) => {
        const matchesSearch =
          sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sensor.description && sensor.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sensor.type && sensor.type.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = typeFilter === '' || sensor.type === typeFilter;
        return matchesSearch && matchesType;
      })
    : [];

  const sensorTypes = Array.isArray(sensors)
    ? Array.from(new Set(sensors.map((sensor: Sensor) => sensor.type).filter(Boolean)))
    : [];

  const handleAddSensor = () => {
    navigate('/sensors/create');
  };

  if (isLoading && (!sensors || sensors.length === 0)) {
    return <LoadingScreen />;
  }

  return (
    <SensorListComponent
      sensors={filteredSensors}
      error={error}
      isLoading={isLoading}
      searchTerm={searchTerm}
      sensorTypes={sensorTypes}
      typeFilter={typeFilter}
      windowWidth={windowWidth}
      onAddSensor={handleAddSensor}
      setSearchTerm={setSearchTerm}
      setTypeFilter={setTypeFilter}
    />
  );
};

export default SensorList; 