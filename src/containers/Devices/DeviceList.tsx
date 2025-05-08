import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import { fetchDevices, selectDevices, selectDevicesLoading, selectDevicesError } from '../../state/slices/devices.slice';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import DeviceList from '../../components/devices/DeviceList';

const DeviceListContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const devicesData = useSelector(selectDevices);
  const isLoading = useSelector(selectDevicesLoading);
  const error = useSelector(selectDevicesError);
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
  
  // Ensure devices is always an array with defensive check
  const devices = Array.isArray(devicesData) ? devicesData : [];
  
  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);
  
  // Apply defensive check before filtering
  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.description && device.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      device.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '' || device.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  // Get unique device types for filter
  const deviceTypes = Array.from(new Set(devices.map(device => device.type)));
  
  if (isLoading && devices.length === 0) {
    return <LoadingScreen />;
  }
  
  const handleAddDevice = () => {
    navigate('/devices/create');
  };
  
  return (
    <DeviceList
      devices={devices}
      filteredDevices={filteredDevices}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      deviceTypes={deviceTypes}
      onAddDevice={handleAddDevice}
      isLoading={isLoading}
      error={error}
      windowWidth={windowWidth}
    />
  );
};

export default DeviceListContainer; 