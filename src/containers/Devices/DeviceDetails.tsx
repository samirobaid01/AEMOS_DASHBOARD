import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../state/store';
import {
  fetchDeviceDetails,
  updateDeviceState,
  selectDeviceDetails,
  selectDeviceDetailsLoading,
  selectDeviceDetailsError,
  clearDeviceDetails,
  updateDeviceStateLocally
} from '../../state/slices/deviceDetails.slice';
import { selectSelectedOrganization } from '../../state/slices/organizations.slice';
import { selectSelectedOrganizationId } from '../../state/slices/auth.slice';
import { fetchAreaById, selectSelectedArea } from '../../state/slices/areas.slice';
import DeviceDetailsComponent from '../../components/devices/DeviceDetails';
import { io } from 'socket.io-client';
import type { DeviceStateNotification } from '../../hooks/useDeviceStateSocket';
import { API_URL } from '../../config';

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const device = useSelector(selectDeviceDetails);
  const organization = useSelector(selectSelectedOrganization);
  const organizationId = useSelector(selectSelectedOrganizationId);
  const authToken = useSelector((state: RootState) => state.auth.token) || '';
  const area = useSelector(selectSelectedArea);
  const isLoading = useSelector(selectDeviceDetailsLoading);
  const error = useSelector(selectDeviceDetailsError);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketError, setSocketError] = useState<Error | null>(null);

  // Handle notifications
  const handleNotification = useCallback((notification: DeviceStateNotification) => {
    if (!device?.uuid || !notification.metadata) return;

    console.log('[DeviceDetails] Received notification:', {
      deviceUuid: notification.metadata.deviceUuid,
      currentDeviceUuid: device.uuid,
      stateName: notification.metadata.stateName,
      newValue: notification.metadata.newValue
    });

    if (notification.metadata.deviceUuid !== device.uuid) {
      return;
    }

    const state = device.states.find(s => s.stateName === notification.metadata.stateName);
    if (!state) return;

    dispatch(updateDeviceStateLocally({
      stateId: state.id,
      value: notification.metadata.newValue
    }));
  }, [device, dispatch]);

  // Handle socket connection
  useEffect(() => {
    if (!device?.uuid || !authToken) {
      return;
    }

    try {
      // Create socket instance
      const socket = io(API_URL.replace('/api/v1/', ''), {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        auth: { token: authToken }
      });

      // Store socket reference
      socketRef.current = socket;

      // Set up event handlers
      socket.on('connect', () => {
        console.log('[DeviceDetails] Socket connected:', socket.id);
        setIsConnected(true);
        
        // Join device room
        const room = `device-uuid-${device.uuid}`;
        console.log('[DeviceDetails] Joining room:', room);
        socket.emit('join', room);
      });

      socket.on('disconnect', () => {
        console.log('[DeviceDetails] Socket disconnected');
        setIsConnected(false);
      });

      socket.on('device-state-change', handleNotification);

      socket.on('connect_error', (error: Error) => {
        console.error('[DeviceDetails] Socket connection error:', error);
        setSocketError(error);
      });

      // Connect socket
      console.log('[DeviceDetails] Initializing socket connection');
      socket.connect();

      // Cleanup
      return () => {
        console.log('[DeviceDetails] Cleaning up socket connection');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('device-state-change');
        socket.off('connect_error');
        socket.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setSocketError(null);
      };
    } catch (error) {
      console.error('[DeviceDetails] Socket setup error:', error);
      setSocketError(error instanceof Error ? error : new Error('Failed to setup socket'));
    }
  }, [device?.uuid, authToken, handleNotification]);

  useEffect(() => {
    if (id && organizationId) {
     dispatch(fetchDeviceDetails({ 
        deviceId: parseInt(id, 10),
        organizationId 
      }));
    }
    
    return () => {
      dispatch(clearDeviceDetails());
    };
  }, [dispatch, id, organizationId]);

  // Fetch area data when device changes
  useEffect(() => {
    if (device?.areaId) {
      dispatch(fetchAreaById(device.areaId));
    }
  }, [dispatch, device?.areaId]);

  const handleStateChange = async (stateId: number, value: string) => {
    if (!id || !organizationId) return;
    
    try {
      await dispatch(updateDeviceState({
        deviceId: parseInt(id, 10),
        stateId,
        value,
        organizationId
      })).unwrap();
    } catch (error) {
      console.error('Error updating device state:', error);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      if (organizationId) {
        navigate(`/organizations/${organizationId}/devices`);
      } else {
        navigate('/devices');
      }
    } catch (error) {
      console.error('Error deleting device:', error);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleNavigateBack = () => {
    if (organizationId) {
      navigate(`/organizations/${organizationId}/devices`);
    } else {
      navigate('/devices');
    }
  };

  return (
    <DeviceDetailsComponent
      device={device}
      organization={organization}
      area={area}
      isLoading={isLoading}
      error={error}
      isDeleting={isDeleting}
      deleteModalOpen={deleteModalOpen}
      onDelete={handleDelete}
      onOpenDeleteModal={() => setDeleteModalOpen(true)}
      onCloseDeleteModal={() => setDeleteModalOpen(false)}
      onNavigateBack={handleNavigateBack}
      onStateChange={handleStateChange}
      isSocketConnected={isConnected}
      socketError={socketError}
    />
  );
};

export default DeviceDetails; 