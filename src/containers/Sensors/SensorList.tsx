import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import { fetchSensors, selectSensors, selectSensorsLoading, selectSensorsError, fetchSensorsByOrganizationId } from '../../state/slices/sensors.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import SensorListComponent from '../../components/sensors/SensorList';
import type { Sensor } from '../../types/sensor';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
const SensorList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sensors = useSelector(selectSensors) || [];
  const isLoading = useSelector(selectSensorsLoading);
  const selectedOrganizationId = useSelector(selectSelectedOrganizationId);
  const error = useSelector(selectSensorsError);
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
  
  // Fetch sensors
  useEffect(() => {
    console.log('SensorList selectedOrganizationId', selectedOrganizationId);
    if(selectedOrganizationId){
      dispatch(fetchSensorsByOrganizationId(parseInt(selectedOrganizationId.toString(), 10)));
    }else{
      dispatch(fetchSensors());
    }
  }, [dispatch, selectedOrganizationId]);
  
  // Log sensors when they update
  useEffect(() => {
    if (sensors.length > 0) {
      console.log("Sensors updated:", sensors.length);
    }
  }, [sensors]);
  
  // Filter sensors based on search term and type filter
  const filteredSensors = Array.isArray(sensors) 
    ? sensors.filter((sensor: Sensor) => {
        const matchesSearch = 
          sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sensor.description && sensor.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          sensor.type.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === '' || sensor.type === typeFilter;
        
        return matchesSearch && matchesType;
      })
    : [];
  
  // Get unique sensor types for filter
  const sensorTypes = Array.isArray(sensors) 
    ? Array.from(new Set(sensors.map((sensor: Sensor) => sensor.type)))
    : [];
  
  // Handle adding a new sensor
  const handleAddSensor = () => {
    navigate('/sensors/create');
  };
  
  if (isLoading && (!sensors || sensors.length === 0)) {
    return <LoadingScreen />;
  }
  
  return (
    <SensorListComponent
      sensors={sensors}
      isLoading={isLoading}
      error={error}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      sensorTypes={sensorTypes}
      onAddSensor={handleAddSensor}
      windowWidth={windowWidth}
    />
  );
};

export default SensorList; 