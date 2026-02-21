import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { MonitoredEntity, TelemetryData, EntityTelemetryData } from '../components/telemetry/types';
import type { DeviceStateNotification } from './useDeviceStateSocket';

interface UseMultiTelemetryOptions {
  authToken: string;
  serverUrl?: string;
}

interface UseMultiTelemetryReturn {
  telemetryData: TelemetryData;
  addEntity: (entity: MonitoredEntity) => void;
  removeEntity: (entityId: string) => void;
  isConnected: boolean;
}

export const useMultiTelemetry = (options: UseMultiTelemetryOptions): UseMultiTelemetryReturn => {
  const [telemetryData, setTelemetryData] = useState<TelemetryData>({});
  const [isConnected, setIsConnected] = useState(false);
  const [monitoredEntities, setMonitoredEntities] = useState<MonitoredEntity[]>([]);
  
  const socketRef = useRef<Socket | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());
  const monitoredEntitiesRef = useRef<MonitoredEntity[]>([]);
  const serverUrl = options.serverUrl || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

  const initializeTelemetryData = useCallback((entity: MonitoredEntity): EntityTelemetryData => {
    const values: Record<string, { value: string | number | boolean; timestamp: string; isNew: boolean }> = {};
    
    if (entity.type === 'sensor' && entity.telemetryVariables) {
      entity.telemetryVariables.forEach((variable) => {
        values[variable.id.toString()] = {
          value: '-',
          timestamp: new Date().toISOString(),
          isNew: false
        };
      });
    } else if (entity.type === 'device' && entity.states) {
      entity.states.forEach((state) => {
        values[state.id.toString()] = {
          value: state.instances[0]?.value || state.defaultValue,
          timestamp: new Date().toISOString(),
          isNew: false
        };
      });
    }
    
    return {
      connected: false,
      lastUpdate: null,
      values
    };
  }, []);

  const addEntity = useCallback((entity: MonitoredEntity) => {
    setMonitoredEntities(prev => {
      if (prev.some(e => e.id === entity.id)) {
        return prev;
      }
      return [...prev, entity];
    });

    const initialData = initializeTelemetryData(entity);
    setTelemetryData(prev => ({
      ...prev,
      [entity.id]: {
        ...initialData,
        connected: isConnected
      }
    }));
  }, [initializeTelemetryData, isConnected]);

  const removeEntity = useCallback((entityId: string) => {
    const entity = monitoredEntities.find(e => e.id === entityId);
    
    if (entity && socketRef.current?.connected) {
      console.log(`[MultiTelemetry] Removing entity: ${entity.name} (${entity.type})`);
      
      if (entity.type === 'sensor' && entity.telemetryVariables) {
        entity.telemetryVariables.forEach((variable) => {
          const roomName = `telemetry-${variable.id}`;
          console.log(`[MultiTelemetry] Leaving room: ${roomName}`);
          socketRef.current?.emit('leave', roomName);
          joinedRoomsRef.current.delete(roomName);
        });
      } else if (entity.type === 'device' && entity.uuid) {
        const roomName = `device-uuid-${entity.uuid}`;
        console.log(`[MultiTelemetry] Leaving room: ${roomName}`);
        socketRef.current?.emit('leave', roomName);
        joinedRoomsRef.current.delete(roomName);
      }
    }

    setMonitoredEntities(prev => prev.filter(e => e.id !== entityId));
    setTelemetryData(prev => {
      const newData = { ...prev };
      delete newData[entityId];
      return newData;
    });
  }, [monitoredEntities]);

  useEffect(() => {
    monitoredEntitiesRef.current = monitoredEntities;
  }, [monitoredEntities]);

  useEffect(() => {
    if (!options.authToken) {
      return;
    }

    socketRef.current = io(serverUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: { token: options.authToken }
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('[MultiTelemetry] Connected to socket:', socket.id);
      setIsConnected(true);

      setTelemetryData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(entityId => {
          updated[entityId] = { ...updated[entityId], connected: true };
        });
        return updated;
      });
    });

    socket.on('disconnect', () => {
      console.log('[MultiTelemetry] Disconnected from socket');
      setIsConnected(false);
      setTelemetryData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(entityId => {
          updated[entityId] = { ...updated[entityId], connected: false };
        });
        return updated;
      });
    });

    socket.on('connect_error', (error) => {
      console.error('[MultiTelemetry] Connection error:', error);
      setIsConnected(false);
    });

    socket.on('new-datastream', (payload: any) => {
      console.log('[MultiTelemetry] New datastream received:', payload);
      
      let telemetryDataId: number;
      let value: string | number;
      let timestamp: string;

      if (payload.dataStream) {
        telemetryDataId = payload.dataStream.telemetryDataId;
        value = payload.dataStream.value;
        timestamp = payload.timestamp || payload.dataStream.recievedAt || new Date().toISOString();
        console.log('[MultiTelemetry] Extracted from nested format - telemetryDataId:', telemetryDataId, 'value:', value, 'timestamp:', timestamp);
      } else {
        telemetryDataId = payload.telemetryDataId;
        value = payload.value;
        timestamp = payload.recievedAt || payload.timestamp || new Date().toISOString();
        console.log('[MultiTelemetry] Extracted from flat format - telemetryDataId:', telemetryDataId, 'value:', value, 'timestamp:', timestamp);
      }

      if (!telemetryDataId || value === undefined) {
        console.warn('[MultiTelemetry] Invalid datastream payload - telemetryDataId:', telemetryDataId, 'value:', value);
        console.warn('[MultiTelemetry] Full payload:', payload);
        return;
      }

      const entities = monitoredEntitiesRef.current;
      const entity = entities.find(
        e => e.type === 'sensor' && e.telemetryVariables?.some(v => v.id === telemetryDataId)
      );

      if (entity) {
        console.log(`[MultiTelemetry] Updating sensor ${entity.name} - telemetryDataId: ${telemetryDataId}, value: ${value}`);
        
        setTelemetryData(prev => ({
          ...prev,
          [entity.id]: {
            ...prev[entity.id],
            lastUpdate: timestamp,
            values: {
              ...prev[entity.id]?.values || {},
              [telemetryDataId]: {
                value,
                timestamp,
                isNew: true
              }
            }
          }
        }));

        setTimeout(() => {
          setTelemetryData(prev => {
            if (prev[entity.id]?.values?.[telemetryDataId]) {
              return {
                ...prev,
                [entity.id]: {
                  ...prev[entity.id],
                  values: {
                    ...prev[entity.id].values,
                    [telemetryDataId]: {
                      ...prev[entity.id].values[telemetryDataId],
                      isNew: false
                    }
                  }
                }
              };
            }
            return prev;
          });
        }, 2000);
      } else {
        console.warn(`[MultiTelemetry] No matching sensor found for telemetryDataId: ${telemetryDataId}`);
      }
    });

    socket.on('device-state-change', (notification: DeviceStateNotification) => {
      console.log('[MultiTelemetry] Device state change received:', notification);
      
      const entities = monitoredEntitiesRef.current;
      console.log('[MultiTelemetry] Currently monitored entities:', entities.map(e => ({ 
        id: e.id, 
        type: e.type, 
        name: e.name, 
        uuid: e.uuid 
      })));
      
      const entity = entities.find(
        e => e.type === 'device' && e.uuid === notification.metadata.deviceUuid
      );

      if (entity && entity.states) {
        console.log(`[MultiTelemetry] Found device: ${entity.name}, searching for state: ${notification.metadata.stateName}`);
        const state = entity.states.find(s => s.stateName === notification.metadata.stateName);
        
        if (state) {
          console.log(`[MultiTelemetry] Updating device ${entity.name} - state: ${notification.metadata.stateName}, value: ${notification.metadata.newValue}`);
          
          setTelemetryData(prev => ({
            ...prev,
            [entity.id]: {
              ...prev[entity.id],
              lastUpdate: notification.timestamp.toString(),
              values: {
                ...prev[entity.id]?.values || {},
                [state.id]: {
                  value: notification.metadata.newValue,
                  timestamp: notification.timestamp.toString(),
                  isNew: true
                }
              }
            }
          }));

          setTimeout(() => {
            setTelemetryData(prev => {
              if (prev[entity.id]?.values[state.id]) {
                return {
                  ...prev,
                  [entity.id]: {
                    ...prev[entity.id],
                    values: {
                      ...prev[entity.id].values,
                      [state.id]: {
                        ...prev[entity.id].values[state.id],
                        isNew: false
                      }
                    }
                  }
                };
              }
              return prev;
            });
          }, 2000);
        } else {
          console.warn(`[MultiTelemetry] State '${notification.metadata.stateName}' not found in device ${entity.name}`);
        }
      } else if (!entity) {
        console.warn(`[MultiTelemetry] No matching device found for UUID: ${notification.metadata.deviceUuid}`);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [options.authToken, serverUrl]);

  useEffect(() => {
    const socket = socketRef.current;
    
    if (!socket?.connected) {
      return;
    }

    monitoredEntities.forEach(entity => {
      if (entity.type === 'sensor' && entity.telemetryVariables) {
        entity.telemetryVariables.forEach(variable => {
          const roomName = `telemetry-${variable.id}`;
          if (!joinedRoomsRef.current.has(roomName)) {
            console.log(`[MultiTelemetry] Joining room: ${roomName}`);
            socket.emit('join', roomName);
            joinedRoomsRef.current.add(roomName);
          }
        });
      } else if (entity.type === 'device' && entity.uuid) {
        const roomName = `device-uuid-${entity.uuid}`;
        if (!joinedRoomsRef.current.has(roomName)) {
          console.log(`[MultiTelemetry] Joining room: ${roomName}`);
          socket.emit('join', roomName);
          joinedRoomsRef.current.add(roomName);
        }
      }
    });
  }, [monitoredEntities]);

  return {
    telemetryData,
    addEntity,
    removeEntity,
    isConnected
  };
};
