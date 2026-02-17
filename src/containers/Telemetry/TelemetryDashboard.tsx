import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import { fetchAreas, selectAreas } from '../../state/slices/areas.slice';
import { fetchSensors, selectSensors } from '../../state/slices/sensors.slice';
import { fetchDevices, selectDevices } from '../../state/slices/devices.slice';
import { fetchSensorById } from '../../state/slices/sensors.slice';
import { fetchDeviceDetails } from '../../state/slices/deviceDetails.slice';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import TelemetryDashboardComponent from '../../components/telemetry/TelemetryDashboard';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { useMultiTelemetry } from '../../hooks/useMultiTelemetry';
import type { MonitoredEntity } from '../../components/telemetry/types';

const TelemetryDashboard = () => {
  const dispatch = useAppDispatch();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [monitoredEntities, setMonitoredEntities] = useState<MonitoredEntity[]>([]);

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<number | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  
  const [selectedSensorDetails, setSelectedSensorDetails] = useState<any>(null);
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState<any>(null);

  const organizations = useAppSelector(selectOrganizations);
  const areas = useAppSelector(selectAreas);
  const sensors = useAppSelector(selectSensors);
  const devices = useAppSelector(selectDevices);
  const authToken = useAppSelector((state) => state.auth.token) || '';
  const organizationId = useAppSelector(selectSelectedOrganizationId);

  const { telemetryData, addEntity, removeEntity, isConnected } = useMultiTelemetry({
    authToken,
    serverUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchOrganizations()),
          dispatch(fetchAreas()),
          dispatch(fetchSensors()),
          dispatch(fetchDevices())
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedSensorId) {
      dispatch(fetchSensorById(selectedSensorId))
        .unwrap()
        .then((details) => {
          console.log('[TelemetryDashboard] Fetched sensor details:', details);
          setSelectedSensorDetails(details);
        })
        .catch((error) => {
          console.error('Error fetching sensor details:', error);
          setSelectedSensorDetails(null);
        });
    } else {
      setSelectedSensorDetails(null);
    }
  }, [selectedSensorId, dispatch]);

  useEffect(() => {
    if (selectedDeviceId && organizationId) {
      dispatch(fetchDeviceDetails({ deviceId: selectedDeviceId, organizationId }))
        .unwrap()
        .then((details) => {
          console.log('[TelemetryDashboard] Fetched device details:', details);
          setSelectedDeviceDetails(details);
        })
        .catch((error) => {
          console.error('Error fetching device details:', error);
          setSelectedDeviceDetails(null);
        });
    } else {
      setSelectedDeviceDetails(null);
    }
  }, [selectedDeviceId, organizationId, dispatch]);

  const handleAddEntity = useCallback(async () => {
    if (selectedSensorId && selectedSensorDetails) {
      const sensor = sensors.find(s => s.id === selectedSensorId);

      if (!sensor) {
        console.error('Sensor not found');
        return;
      }

      try {
        console.log('Using cached sensor details:', selectedSensorDetails);
        
        let areaName = 'Unknown Area';
        let organizationName = 'Unknown Organization';
        
        if (selectedSensorDetails.area) {
          areaName = selectedSensorDetails.area.name;
          const org = organizations.find(o => o.id === selectedSensorDetails.area!.organizationId);
          if (org) {
            organizationName = org.name;
          }
        } else if (selectedSensorDetails.areaId) {
          const area = areas.find(a => a.id === selectedSensorDetails.areaId);
          if (area) {
            areaName = area.name;
            const org = organizations.find(o => o.id === area.organizationId);
            if (org) {
              organizationName = org.name;
            }
          }
        } else if (sensor.areaId) {
          const area = areas.find(a => a.id === sensor.areaId);
          if (area) {
            areaName = area.name;
            const org = organizations.find(o => o.id === area.organizationId);
            if (org) {
              organizationName = org.name;
            }
          }
        }

        const entity: MonitoredEntity = {
          id: `sensor-${selectedSensorId}`,
          type: 'sensor',
          entityId: selectedSensorId,
          name: selectedSensorDetails.name || sensor.name,
          areaName,
          organizationName,
          telemetryVariables: selectedSensorDetails.TelemetryData || []
        };

        addEntity(entity);
        setMonitoredEntities(prev => [...prev, entity]);
        
        setSelectedSensorId(null);
      } catch (error) {
        console.error('Error adding sensor:', error);
      }
    } else if (selectedDeviceId && selectedDeviceDetails) {
      const device = devices.find(d => d.id === selectedDeviceId);

      if (!device) {
        console.error('Device not found');
        return;
      }

      try {
        console.log('Using cached device details:', selectedDeviceDetails);
        console.log('Device from list:', device);
        
        const deviceUuid = selectedDeviceDetails.uuid || device.uuid;
        console.log('Final device UUID:', deviceUuid);
        
        if (!deviceUuid) {
          console.error('Device UUID is missing from both selectedDeviceDetails and device');
        }
        
        let areaName = 'Unknown Area';
        let organizationName = 'Unknown Organization';
        
        if (selectedDeviceDetails.areaId) {
          const area = areas.find(a => a.id === selectedDeviceDetails.areaId);
          if (area) {
            areaName = area.name;
            const org = organizations.find(o => o.id === area.organizationId);
            if (org) {
              organizationName = org.name;
            }
          }
        } else if (device.areaId) {
          const area = areas.find(a => a.id === device.areaId);
          if (area) {
            areaName = area.name;
            const org = organizations.find(o => o.id === area.organizationId);
            if (org) {
              organizationName = org.name;
            }
          }
        }
        
        if (organizationName === 'Unknown Organization' && selectedDeviceDetails.organizationId) {
          const org = organizations.find(o => o.id === selectedDeviceDetails.organizationId);
          if (org) {
            organizationName = org.name;
          }
        }

        const entity: MonitoredEntity = {
          id: `device-${selectedDeviceId}`,
          type: 'device',
          entityId: selectedDeviceId,
          uuid: deviceUuid,
          name: selectedDeviceDetails.name || device.name,
          areaName,
          organizationName,
          states: selectedDeviceDetails.states || []
        };

        console.log('Created device entity:', entity);

        addEntity(entity);
        setMonitoredEntities(prev => [...prev, entity]);
        
        setSelectedDeviceId(null);
      } catch (error) {
        console.error('Error adding device:', error);
      }
    }
  }, [
    selectedSensorId,
    selectedDeviceId,
    selectedSensorDetails,
    selectedDeviceDetails,
    sensors,
    devices,
    areas,
    organizations,
    addEntity
  ]);

  const handleRemoveEntity = useCallback((entityId: string) => {
    removeEntity(entityId);
    setMonitoredEntities(prev => prev.filter(e => e.id !== entityId));
  }, [removeEntity]);

  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <TelemetryDashboardComponent
      monitoredEntities={monitoredEntities}
      telemetryData={telemetryData}
      organizations={organizations}
      areas={areas}
      sensors={sensors.map(s => 
        s.id === selectedSensorId && selectedSensorDetails 
          ? { ...s, TelemetryData: selectedSensorDetails.TelemetryData, description: selectedSensorDetails.description }
          : s
      )}
      devices={devices
        .filter((d): d is typeof d & { uuid: string } => d.uuid != null && d.uuid !== '')
        .map(d => 
          d.id === selectedDeviceId && selectedDeviceDetails 
            ? { ...d, states: selectedDeviceDetails.states, description: selectedDeviceDetails.description }
            : d
        )}
      selectedOrgId={selectedOrgId}
      selectedAreaId={selectedAreaId}
      selectedSensorId={selectedSensorId}
      selectedDeviceId={selectedDeviceId}
      onOrgChange={setSelectedOrgId}
      onAreaChange={setSelectedAreaId}
      onSensorChange={setSelectedSensorId}
      onDeviceChange={setSelectedDeviceId}
      onAddEntity={handleAddEntity}
      onRemoveEntity={handleRemoveEntity}
      windowWidth={windowWidth}
      isLoading={!isConnected}
    />
  );
};

export default TelemetryDashboard;
